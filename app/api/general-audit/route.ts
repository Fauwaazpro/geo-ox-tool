import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000)

async function crawlPage(page: any, url: string) {
    if (!url) return null
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

        return await page.evaluate(() => {
            const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText)
            const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText)
            const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.innerText)
            const images = Array.from(document.querySelectorAll('img'))
            const links = Array.from(document.querySelectorAll('a'))
            const scripts = document.querySelectorAll('script')
            const text = document.body.innerText

            return {
                url: window.location.href,
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                wordCount: text.split(/\s+/).length,
                h1Count: h1s.length,
                h2Count: h2s.length,
                h3Count: h3s.length,
                h1s,
                h2s,
                h3s,
                imageCount: images.length,
                imagesMissingAlt: images.filter(img => !img.alt).length,
                internalLinkCount: links.filter(a => a.hostname === window.location.hostname).length,
                externalLinkCount: links.filter(a => a.hostname !== window.location.hostname).length,
                scriptCount: scripts.length
            }
        })
    } catch (e) {
        console.error(`Failed to crawl ${url}`, e)
        return null
    }
}

export async function POST(request: Request) {
    const { url, keyword, competitorUrl } = await request.json()

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const cacheKey = `audit_gap_${normalizeInput(url)}_${normalizeInput(keyword || '')}_${normalizeInput(competitorUrl || '')}`
    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()

        // 1. Crawl User Page
        const userMetrics = await crawlPage(page, url)
        if (!userMetrics) throw new Error('Failed to crawl user page')

        // 2. Determine Competitor
        let targetCompetitorUrl = competitorUrl
        let competitorMetrics = null

        if (keyword && !targetCompetitorUrl) {
            // Search for competitor
            await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(keyword)}`, { waitUntil: 'networkidle0' })
            targetCompetitorUrl = await page.evaluate((userDomain: string) => {
                const results = Array.from(document.querySelectorAll('.result__a')) as HTMLAnchorElement[]
                for (const res of results) {
                    if (!res.href.includes(userDomain) && !res.href.includes('duckduckgo')) {
                        return res.href
                    }
                }
                return null
            }, new URL(url).hostname)
        }

        if (targetCompetitorUrl) {
            competitorMetrics = await crawlPage(page, targetCompetitorUrl)
        }

        await browser.close()
        browser = null

        // 3. Compare & Generate Gaps
        type Gap = { category: string, issue: string, detail: string }
        const gaps: Gap[] = []
        if (competitorMetrics) {
            if (userMetrics.wordCount < competitorMetrics.wordCount * 0.8) {
                gaps.push({ category: 'Content Depth', issue: `Thin Content`, detail: `You have ${userMetrics.wordCount} words, competitor has ${competitorMetrics.wordCount}.` })
            }
            if (userMetrics.h2Count < competitorMetrics.h2Count * 0.5) {
                gaps.push({ category: 'Structure', issue: `Missing Headings`, detail: `Competitor uses ${competitorMetrics.h2Count} H2s, you use ${userMetrics.h2Count}.` })
            }
            if (userMetrics.internalLinkCount < competitorMetrics.internalLinkCount * 0.5) {
                gaps.push({ category: 'Links', issue: `Low Internal Linking`, detail: `Competitor has ${competitorMetrics.internalLinkCount} internal links, you have ${userMetrics.internalLinkCount}.` })
            }
            if (userMetrics.imageCount < competitorMetrics.imageCount * 0.5) {
                gaps.push({ category: 'Visuals', issue: `Fewer Images`, detail: `Competitor has ${competitorMetrics.imageCount} images, you have ${userMetrics.imageCount}.` })
            }
            if (!userMetrics.description && competitorMetrics.description) {
                gaps.push({ category: 'Meta Tags', issue: `Missing Description`, detail: `Competitor has a meta description, you don't.` })
            }
        }

        const responseData = {
            user: userMetrics,
            competitor: competitorMetrics,
            gaps,
            scannedAt: new Date().toISOString()
        }

        cache.set(cacheKey, responseData)
        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        console.error(error)
        return NextResponse.json({ error: 'Analysis failed', message: error.message }, { status: 500 })
    }
}
