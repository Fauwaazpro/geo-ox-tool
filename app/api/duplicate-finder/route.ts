import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000)

// 1. Helper: 4-Gram Shingling for Near-Duplicate Detection
// Breaks text into overlapping 4-word chunks
function getShingles(text: string, n: number = 4): Set<string> {
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0)
    const shingles = new Set<string>()
    if (words.length < n) return shingles
    for (let i = 0; i <= words.length - n; i++) {
        shingles.add(words.slice(i, i + n).join(' '))
    }
    return shingles
}

// 2. Helper: Jaccard Similarity Coefficient
// Intersection / Union of two sets
function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0
    const intersection = new Set([...setA].filter(x => setB.has(x)))
    const union = new Set([...setA, ...setB])
    return (intersection.size / union.size) * 100
}

interface PageData {
    url: string
    shingles: Set<string>
    wordCount: number
    sampleText: string
    _rawText?: string
}

export async function POST(request: Request) {
    const { url } = await request.json()

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const normalizedUrl = normalizeInput(url)
    const domain = new URL(normalizedUrl).origin
    const cacheKey = `dup_finder_${domain}`

    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()

        // 3. Discovery Phase: Find internal links (Limit 25 for speed)
        await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
        const links = (await page.evaluate((origin: string) => {
            const anchors = Array.from(document.querySelectorAll('a'))
            return Array.from(new Set(anchors
                .map(a => a.href)
                .filter(href => href.startsWith(origin) && !href.includes('#') && !href.match(/\.(jpg|png|pdf)$/))
            )).slice(0, 25)
        }, domain)) as string[]

        // Make sure we include the start URL
        if (!links.includes(normalizedUrl)) links.unshift(normalizedUrl)

        // 4. Crawl & Fingerprint Phase
        const crawledPages: PageData[] = []

        for (const link of links) {
            try {
                await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 10000 })
                // Custom extraction to ignore header/footer navigation
                const content = await page.evaluate(() => {
                    // Primitive heuristic: Remove header/footer/nav tags before text extraction
                    const clone = document.body.cloneNode(true) as HTMLElement
                    const toRemove = clone.querySelectorAll('nav, header, footer, .menu, .sidebar, script, style')
                    toRemove.forEach(el => el.remove())
                    return clone.innerText
                })

                if (content.length > 200) { // Ignore empty pages
                    crawledPages.push({
                        url: link,
                        shingles: new Set(), // Will hydrate below (Sets can't be passed from evaluate easily)
                        wordCount: content.split(/\s+/).length,
                        sampleText: content.slice(0, 100) + '...',
                        _rawText: content // Temp storage
                    })
                }
            } catch (e) {
                console.log(`Failed to crawl ${link}`)
            }
        }

        await browser.close()
        browser = null

        // 5. Compute Shingles (Node-side)
        crawledPages.forEach(p => {
            p.shingles = getShingles(p._rawText as string)
            delete (p as any)._rawText // Clean up memory
        })

        // 6. Compare All Pairs
        type DuplicateItem = {
            url1: string
            url2: string
            similarity: number
            duplicateText: string
            recommendation: string
        }
        const duplicates: DuplicateItem[] = []
        for (let i = 0; i < crawledPages.length; i++) {
            for (let j = i + 1; j < crawledPages.length; j++) {
                const pageA = crawledPages[i]
                const pageB = crawledPages[j]

                const score = calculateJaccardSimilarity(pageA.shingles, pageB.shingles)

                if (score > 60) { // Threshold: 60% similarity
                    duplicates.push({
                        url1: new URL(pageA.url).pathname,
                        url2: new URL(pageB.url).pathname,
                        similarity: Math.round(score),
                        duplicateText: "High text overlap detected.",
                        recommendation: score > 90
                            ? "Content is nearly identical. Use 301 Redirect or Canonical Tag immediately."
                            : "Significant overlap. Consider consolidating content."
                    })
                }
            }
        }

        const responseData = {
            duplicates: duplicates.sort((a, b) => b.similarity - a.similarity).slice(0, 20),
            scannedCount: crawledPages.length
        }

        cache.set(cacheKey, responseData)
        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        console.error('Duplicate scan failed:', error)
        return NextResponse.json({ error: 'Failed to scan for duplicates' }, { status: 500 })
    }
}
