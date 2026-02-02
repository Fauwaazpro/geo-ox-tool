import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
import { SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000)

export async function POST(request: Request) {
    const { url } = await request.json()

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const cacheKey = `topic_map_${normalizeInput(url)}`
    const cached = cache.get(cacheKey)
    if (cached) return NextResponse.json(cached)

    let browser = null
    try {
        browser = await getBrowser()
        const page = await browser.newPage()
        const origin = new URL(url).origin

        // Data structures
        const pages = new Set<string>()
        type LinkItem = { source: string; target: string }
        const links: LinkItem[] = []
        const queue = [url]
        const visited = new Set<string>()
        const maxPages = 30 // Limit for safety/speed

        // Crawl Loop
        while (queue.length > 0 && visited.size < maxPages) {
            const currentUrl = queue.shift()!
            if (visited.has(currentUrl)) continue
            visited.add(currentUrl)
            pages.add(currentUrl)

            try {
                await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 5000 })

                const foundLinks = (await page.evaluate((origin: string) => {
                    const anchors = Array.from(document.querySelectorAll('a'))
                    return anchors
                        .map(a => a.href)
                        .filter(href => href.startsWith(origin) && !href.includes('#') && !href.match(/\.(jpg|png|pdf|css|js)$/))
                }, origin)) as string[]

                const uniqueLinks = [...new Set(foundLinks)]

                uniqueLinks.forEach(link => {
                    links.push({ source: currentUrl, target: link })
                    if (!visited.has(link) && !queue.includes(link) && visited.size + queue.length < maxPages) {
                        queue.push(link)
                    }
                })

            } catch (err) {
                console.error(`Failed to crawl ${currentUrl}`)
            }
        }

        await browser.close()
        browser = null

        // Process Graph Data
        const nodes = Array.from(pages).map(p => {
            const path = new URL(p).pathname
            return {
                id: p,
                label: path === '/' ? 'Home' : path.split('/').pop() || path,
                type: path === '/' ? 'root' : 'page',
                degree: links.filter(l => l.target === p).length // Incoming links
            }
        })

        // Identify Orphans (pages in the list but with 0 incoming links from other pages in the list)
        // Root is excluded
        const orphans = nodes.filter(n => n.type !== 'root' && n.degree === 0).map(n => n.id)

        // Identify Clusters (Simple community detection via connected components of high degree nodes)
        type Cluster = { name: string; count: number }
        const clusters: Cluster[] = []
        // Group by first path segment
        nodes.forEach(node => {
            const path = new URL(node.id).pathname
            const segment = path.split('/')[1] || 'root'
            const existing = clusters.find(c => c.name === segment)
            if (existing) existing.count++
            else clusters.push({ name: segment, count: 1 })
        })

        const responseData = {
            nodes,
            links: links.filter(l => pages.has(l.source) && pages.has(l.target)), // Only include links where both ends exist in our crawled set
            orphans,
            clusters: clusters.filter(c => c.name !== 'root').sort((a, b) => b.count - a.count),
            scannedCount: visited.size
        }

        cache.set(cacheKey, responseData)
        return NextResponse.json(responseData)

    } catch (error: any) {
        if (browser) await browser.close()
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
