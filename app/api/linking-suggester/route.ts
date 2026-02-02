import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000)

// Helper to crawl a page and extract text + potential keywords
async function crawlForLinking(page: any, url: string, isSource: boolean) {
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

        return await page.evaluate((isSourcePage: boolean) => {
            const title = document.title
            const h1 = document.querySelector('h1')?.innerText || ''
            const text = document.body.innerText
            // Simple heuristic: Get h1, title, and URL segments as "Topic Keywords"
            const urlPath = window.location.pathname.replace(/\//g, ' ').replace(/-/g, ' ')

            return {
                url: window.location.href,
                title,
                h1,
                text: isSourcePage ? text : '', // Only need full text for source
                keywords: [title, h1, urlPath].join(' ').toLowerCase()
            }
        }, isSource)
    } catch (error) {
        console.error(`Failed to crawl ${url}`, error)
        return null
    }
}

export async function POST(request: Request) {
    const { url, domain } = await request.json()

    if (!url) return NextResponse.json({ error: 'Source URL is required' }, { status: 400 })

    const normalizedUrl = normalizeInput(url)
    const normalizedDomain = normalizeInput(domain || new URL(url).origin)
    const cacheKey = `link_suggest_${normalizedUrl}_${normalizedDomain}`

    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()

        // 1. Crawl Source Page
        const sourceData = await crawlForLinking(page, normalizedUrl, true)
        if (!sourceData) throw new Error('Failed to crawl source page')

        // 2. Crawl Domain to find destinations (Limit 20 pages)
        // We start from the domain root and look for links
        await page.goto(normalizedDomain, { waitUntil: 'domcontentloaded', timeout: 30000 })
        const internalLinks = await page.evaluate((domain: string) => {
            const links = Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.includes(domain) && !href.includes('#'))
            return Array.from(new Set(links)).slice(0, 20) // Limit to 20 unique pages
        }, new URL(normalizedDomain).hostname)

        const potentialDestinations = []
        for (const link of internalLinks) {
            if (link === normalizedUrl) continue // Don't link to self
            if (potentialDestinations.length >= 10) break // Limit deep crawling
            const destData = await crawlForLinking(page, link, false)
            if (destData) potentialDestinations.push(destData)
        }

        await browser.close()
        browser = null

        // 3. Match Logic
        const suggestions = []
        const sourceTextLower = sourceData.text.toLowerCase()

        for (const dest of potentialDestinations) {
            // Check if matches
            // We look for the Destination's H1 or Title inside the Source Text
            // This is a naive but effective "Exact Match" strategy for internal linking
            const targetPhrase = dest.h1.toLowerCase()

            if (targetPhrase && targetPhrase.length > 5 && sourceTextLower.includes(targetPhrase)) {
                // Find context
                const index = sourceTextLower.indexOf(targetPhrase)
                const start = Math.max(0, index - 50)
                const end = Math.min(sourceTextLower.length, index + targetPhrase.length + 50)
                const snippet = sourceData.text.substring(start, end).replace(/\n/g, ' ')

                suggestions.push({
                    sourcePageTitle: sourceData.title,
                    sourcePage: new URL(sourceData.url).pathname,
                    targetPage: new URL(dest.url).pathname,
                    anchorText: dest.h1, // Suggest linking the exact phrase
                    context: `...${snippet}...`,
                    relevanceScore: 90 // High confidence for exact string match
                })
            }
        }

        // Fallback: If no direct exact matches, try partial keyword matching
        if (suggestions.length === 0) {
            for (const dest of potentialDestinations) {
                const keywords = dest.keywords.split(' ').filter((w: string) => w.length > 5)
                for (const word of keywords) {
                    if (sourceTextLower.includes(word)) {
                        const index = sourceTextLower.indexOf(word)
                        const start = Math.max(0, index - 40)
                        const end = Math.min(sourceTextLower.length, index + word.length + 40)
                        const snippet = sourceData.text.substring(start, end).replace(/\n/g, ' ')

                        suggestions.push({
                            sourcePageTitle: sourceData.title,
                            sourcePage: new URL(sourceData.url).pathname,
                            targetPage: new URL(dest.url).pathname,
                            anchorText: word,
                            context: `...${snippet}...`,
                            relevanceScore: 75 // Lower confidence
                        })
                        break; // One link per destination max
                    }
                }
            }
        }

        const responseData = { suggestions: suggestions.slice(0, 10) } // Return max 10
        cache.set(cacheKey, responseData)
        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        console.error(error)
        return NextResponse.json({ error: 'Analysis failed', message: error.message }, { status: 500 })
    }
}
