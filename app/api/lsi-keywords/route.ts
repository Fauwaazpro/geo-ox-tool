import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000) // 1 hour cache

export async function POST(request: Request) {
    const { keyword } = await request.json()

    console.log(`[LSI-Extract] Values: ${keyword}`)

    if (!keyword || keyword.length < 2) {
        return NextResponse.json({ error: 'Valid keyword is required' }, { status: 400 })
    }

    const cacheKey = `lsi_v2_${keyword.toLowerCase().trim()}`
    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        console.log('[LSI-Extract] Launching Browser')
        browser = await getBrowser()
        const page = await browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        // Strategy: DuckDuckGo HTML version is vastly robust and easier to scrape than Google
        console.log('[LSI-Extract] Navigating to DDG HTML')
        const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`
        await page.goto(searchUrl, { waitUntil: 'load', timeout: 20000 })

        const data = (await page.evaluate(() => {
            const results: { keyword: string, source: string, relevance: number }[] = []

            // 1. "Related" usually appears as plain links or bold text in snippets

            // Scrape main result Snippets for bold terms (LSI synonyms)
            // DDG bold tag is <b> or <strong>
            const snippets = document.querySelectorAll('.result__snippet b, .result__snippet strong')
            snippets.forEach(el => {
                const text = el.textContent?.trim()
                if (text && text.length > 2 && text.toLowerCase() !== '...') {
                    results.push({ keyword: text, source: 'Snippet Synonym', relevance: 75 })
                }
            })

            // Scrape Titles (Concepts)
            const titles = document.querySelectorAll('.result__title')
            titles.forEach(t => {
                const text = t.textContent?.trim()
                if (text) {
                    // Extract 2-3 word phrases? For now just mark as concept if short
                    if (text.split(' ').length < 5) {
                        results.push({ keyword: text, source: 'Competitor Concept', relevance: 65 })
                    }
                }
            })

            return results
        })) as { keyword: string, source: string, relevance: number }[]

        console.log(`[LSI-Extract] Found ${data.length} raw items from DDG`)

        await browser.close()
        browser = null

        // Processing & Cleaning
        const uniqueKeywords = new Map()
        data.forEach(item => {
            // Clean: remove special chars, trim
            const clean = item.keyword.replace(/[^\w\s-]/g, '').trim()
            if (clean.length > 3 && clean.toLowerCase() !== keyword.toLowerCase()) {
                const key = clean.toLowerCase()
                if (!uniqueKeywords.has(key)) {
                    uniqueKeywords.set(key, { ...item, keyword: clean })
                }
            }
        })

        if (uniqueKeywords.size === 0) {
            // Fallback if scraping completely blocked/failed:
            // Generate standard variations so user always gets value
            const suffixes = ['guide', 'tutorial', 'best practices', 'examples', 'tools', 'strategy', 'benefits', 'vs competitors']
            suffixes.forEach(s => {
                uniqueKeywords.set(`${keyword} ${s}`, { keyword: `${keyword} ${s}`, source: 'Generated Suggestion', relevance: 50 })
            })
        }

        const lsiKeywords = Array.from(uniqueKeywords.values())
            .slice(0, 25)
            .map((item: any) => ({
                keyword: item.keyword,
                relevance: item.relevance,
                searchVolume: "N/A",
                difficulty: "Medium",
                usage: item.source.includes('Snippet') ? 'Body Context' : 'Heading / Title',
                source: item.source
            }))

        const template = `# Content Outline for "${keyword}"
        
## Introduction
Start with a strong definition of ${keyword}, using terms like "${lsiKeywords[0]?.keyword}".

## Core Topics
1. **${lsiKeywords[1]?.keyword || 'Key Concept 1'}**
   - Explain detailed strategy.
2. **${lsiKeywords[2]?.keyword || 'Key Concept 2'}**
   - Compare vs alternatives.

## FAQ & Common Issues
- Address concerns related to "${lsiKeywords[3]?.keyword || 'common problems'}".

## Conclusion
Summarize key takeaways.
`

        const responseData = {
            lsiKeywords,
            contentTemplate: template
        }

        cache.set(cacheKey, responseData)
        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        console.error('LSI extraction error:', error)
        return NextResponse.json({
            error: 'Failed to extract data. Search engine might be blocking requests.',
            details: error.message
        }, { status: 500 })
    }
}
