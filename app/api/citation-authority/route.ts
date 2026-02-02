import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000)

export async function POST(request: Request) {
    const { url, brandName } = await request.json()

    if (!url || !brandName) {
        return NextResponse.json({ error: 'URL and Brand Name are required' }, { status: 400 })
    }

    const cacheKey = `citation_builder_${normalizeInput(url)}_${normalizeInput(brandName)}`
    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()

        // Crawl main page
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })

        // Get all links to internal pages to crawl a few more
        const origin = new URL(url).origin
        const internalLinks = await page.evaluate((origin: string) => {
            const links = Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.startsWith(origin) && !href.includes('#'))
            return [...new Set(links)].slice(0, 3) // Scrape homepage + top 3 internal pages
        }, origin)

        const pagesToCrawl = [url, ...internalLinks]
        const opportunities: any[] = []

        for (const pageUrl of pagesToCrawl) {
            try {
                if (pageUrl !== url) {
                    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 })
                }

                // Execute script in browser to find text nodes containing brand but NOT in <a> tags
                const unlinkedMentions = await page.evaluate((brand: string) => {
                    const mentions: any[] = []
                    const walker = document.createTreeWalker(
                        document.body,
                        NodeFilter.SHOW_TEXT,
                        null
                    )

                    let node
                    while (node = walker.nextNode()) {
                        if (node.textContent && node.textContent.toLowerCase().includes(brand.toLowerCase())) {
                            // Check parent chain for <a> tag
                            let parent = node.parentElement
                            let isLinked = false
                            while (parent) {
                                if (parent.tagName === 'A') {
                                    isLinked = true
                                    break
                                }
                                parent = parent.parentElement
                            }

                            if (!isLinked) {
                                // Capture context (surrounding text)
                                const text = node.textContent.trim()
                                const index = text.toLowerCase().indexOf(brand.toLowerCase())
                                const start = Math.max(0, index - 40)
                                const end = Math.min(text.length, index + brand.length + 40)
                                const snippet = (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '')

                                mentions.push({ snippet, fullText: text })
                            }
                        }
                    }
                    return mentions
                }, brandName)

                // Add to opportunities
                unlinkedMentions.slice(0, 3).forEach((mention: any) => {
                    opportunities.push({
                        domain: new URL(pageUrl).pathname,
                        authority: 0, // Not applicable for internal
                        type: 'Internal Content',
                        opportunity: `Unlinked Mention: "${mention.snippet}"`,
                        context: mention.snippet,
                        pageUrl: pageUrl
                    })
                })

            } catch (err) {
                console.error(`Failed to crawl ${pageUrl}`, err)
            }
        }

        await browser.close()
        browser = null

        // If no internal opportunities found, provide generic external advice BUT marked as such
        // OR return empty if we want to be strict. 
        // Let's being strict but helpful.

        const responseData = {
            opportunities: opportunities.length > 0 ? opportunities : [],
            message: opportunities.length === 0 ? "No unlinked mentions found on scanned pages." : "Found unlinked brand mentions."
        }

        cache.set(cacheKey, responseData)
        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
