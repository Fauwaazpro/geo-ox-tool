import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000)

export async function POST(request: Request) {
    const { url } = await request.json()

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const normalizedUrl = normalizeInput(url)
    const cacheKey = `serp_meta_${normalizedUrl}`

    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()

        // Block resources for speed
        await page.setRequestInterception(true)
        page.on('request', (req: any) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort()
            } else {
                req.continue()
            }
        })

        await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })

        const meta = await page.evaluate(() => {
            return {
                title: document.title || '',
                description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
                h1: document.querySelector('h1')?.innerText || ''
            }
        })

        await browser.close()
        browser = null

        const responseData = { ...meta, url: normalizedUrl }
        cache.set(cacheKey, responseData)

        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        console.error('SERP fetch failed:', error)
        return NextResponse.json({ error: 'Failed to fetch URL metadata' }, { status: 500 })
    }
}
