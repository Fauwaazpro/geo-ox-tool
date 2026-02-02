import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000) // 1 hour cache

// Helper to extract entities (simplified NLP)
function extractEntities(text: string) {
    const words = text.split(/\s+/)
    const frequency: Record<string, number> = {}

    // Filter for potential entities (capitalized words, long words)
    words.forEach(word => {
        const clean = word.replace(/[^a-zA-Z]/g, '')
        if (clean.length > 4 && !['about', 'their', 'which', 'there', 'contact'].includes(clean.toLowerCase())) {
            const key = clean.toLowerCase()
            frequency[key] = (frequency[key] || 0) + 1
        }
    })

    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency
        .slice(0, 30) // Top 30
        .map(([name, count]) => ({ name, count }))
}

export async function POST(request: Request) {
    const { url, keyword, competitorUrl } = await request.json()

    if (!url || !keyword) {
        return NextResponse.json({ error: 'URL and Keyword are required' }, { status: 400 })
    }

    const cacheKey = `seo_mapper_${normalizeInput(url)}_${normalizeInput(keyword)}`
    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()

        // 1. Crawl User Page
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
        const userText = await page.evaluate(() => document.body.innerText)
        const userEntities = extractEntities(userText)

        // 2. Find/Crawl Competitor
        let targetCompetitorUrl = competitorUrl

        if (!targetCompetitorUrl) {
            // Smart Search Simulation (Active Crawl)
            // We search for the keyword and take the first non-ad result
            await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(keyword)}`, { waitUntil: 'networkidle0' })
            targetCompetitorUrl = await page.evaluate(() => {
                const firstResult = document.querySelector('.result__a') as HTMLAnchorElement
                return firstResult ? firstResult.href : null
            })
        }

        if (!targetCompetitorUrl) {
            // Fallback if search fails
            targetCompetitorUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(keyword)
        }

        // 3. Crawl Competitor Page
        await page.goto(targetCompetitorUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
        const competitorText = await page.evaluate(() => document.body.innerText)
        const competitorEntities = extractEntities(competitorText)

        await browser.close()
        browser = null

        // 4. Analysis: Calculate Gaps
        const gaps = []

        for (const compEntity of competitorEntities) {
            const userEntity = userEntities.find(e => e.name === compEntity.name)
            const userCount = userEntity ? userEntity.count : 0
            const diff = compEntity.count - userCount

            if (diff > 0) {
                gaps.push({
                    name: compEntity.name,
                    yourCount: userCount,
                    competitorAvg: compEntity.count, // Using single competitor as "avg" for 1-to-1 comparison
                    gap: -diff,
                    priority: diff > 5 ? 'high' : diff > 2 ? 'medium' : 'low'
                })
            }
        }

        // Sort by priority
        gaps.sort((a, b) => a.gap - b.gap) // Ascending (more negative = bigger gap)

        const responseData = {
            entities: gaps,
            competitorUrl: targetCompetitorUrl,
            meta: {
                userWordCount: userText.split(/\s+/).length,
                competitorWordCount: competitorText.split(/\s+/).length
            }
        }

        cache.set(cacheKey, responseData)
        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        console.error('SEO Mapper failed:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
