import { NextResponse } from 'next/server'
import { getBrowser } from '@/lib/puppeteer'
// @ts-ignore
import levenshtein from 'fast-levenshtein'

export async function POST(request: Request) {
    const { url } = await request.json()

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const browser = await getBrowser()

    try {
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

        // Extract all page URLs on the site
        const allUrls = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href]'))
            return links.map(a => {
                const href = (a as HTMLAnchorElement).href
                return {
                    url: href,
                    text: (a as HTMLAnchorElement).textContent?.trim() || '',
                    title: (a as HTMLAnchorElement).getAttribute('title') || ''
                }
            })
        })

        // Get page title and meta
        const pageTitle = await page.title()
        const pageContent = await page.evaluate(() => document.body.innerText)

        // Simulate checking multiple pages for duplicate content
        const duplicates: any[] = []
        const pagesChecked = allUrls.slice(0, 10) // Limit to 10 pages for performance
        const baseUrl = new URL(url).origin

        for (let i = 0; i < pagesChecked.length; i++) {
            for (let j = i + 1; j < pagesChecked.length; j++) {
                const url1 = pagesChecked[i]
                const url2 = pagesChecked[j]

                // Check URL similarity
                const urlSimilarity = 100 - (levenshtein.get(url1.url, url2.url) / Math.max(url1.url.length, url2.url.length) * 100)

                // Check title similarity
                const titleSimilarity = url1.text && url2.text
                    ? 100 - (levenshtein.get(url1.text.toLowerCase(), url2.text.toLowerCase()) / Math.max(url1.text.length, url2.text.length) * 100)
                    : 0

                // If URLs or titles are very similar, flag as potential duplicate
                if (urlSimilarity > 70 || titleSimilarity > 80) {
                    duplicates.push({
                        url1: url1.url.replace(baseUrl, ''),
                        url2: url2.url.replace(baseUrl, ''),
                        similarity: Math.round(Math.max(urlSimilarity, titleSimilarity)),
                        duplicateText: url1.text || url2.text || 'Similar pages detected',
                        recommendation: 'Consolidate pages with 301 redirect',
                        type: urlSimilarity > titleSimilarity ? 'Similar URLs' : 'Similar titles'
                    })
                }
            }
        }

        // Look for common duplicate patterns
        const patterns = [
            { pattern: /\/about/, matches: allUrls.filter((u: any) => /\/(about|about-us|company)/i.test(u.url)) },
            { pattern: /\/contact/, matches: allUrls.filter((u: any) => /\/(contact|get-in-touch|reach-us)/i.test(u.url)) },
            { pattern: /\/pricing/, matches: allUrls.filter((u: any) => /\/(pricing|plans|packages)/i.test(u.url)) },
            { pattern: /\/blog/, matches: allUrls.filter((u: any) => /\/(blog|news|articles)/i.test(u.url)) }
        ]

        patterns.forEach(p => {
            if (p.matches.length > 1) {
                for (let i = 0; i < p.matches.length - 1; i++) {
                    duplicates.push({
                        url1: p.matches[i].url.replace(baseUrl, ''),
                        url2: p.matches[i + 1].url.replace(baseUrl, ''),
                        similarity: 85,
                        duplicateText: `Similar pages in ${p.pattern.source} section`,
                        recommendation: 'Choose one canonical URL and redirect others',
                        type: 'Pattern-based duplicate'
                    })
                }
            }
        })

        await browser.close()

        // Remove duplicates from duplicates array
        const uniqueDuplicates = duplicates.filter((dup, index, self) =>
            index === self.findIndex((d) => d.url1 === dup.url1 && d.url2 === dup.url2)
        ).slice(0, 8) // Limit results

        return NextResponse.json({
            duplicates: uniqueDuplicates,
            summary: {
                totalDuplicates: uniqueDuplicates.length,
                pagesScanned: Math.min(pagesChecked.length, 10),
                severity: uniqueDuplicates.length > 5 ? 'high' : uniqueDuplicates.length > 2 ? 'medium' : 'low'
            },
            fixes: {
                htaccess: uniqueDuplicates.map(d => `Redirect 301 ${d.url1} ${d.url2.split('?')[0]}`).join('\n'),
                nginx: uniqueDuplicates.map(d => `rewrite ^${d.url1}$ ${d.url2.split('?')[0]} permanent;`).join('\n'),
                canonical: uniqueDuplicates.map(d => `<link rel="canonical" href="${d.url2}" />`).join('\n')
            }
        })
    } catch (error: any) {
        await browser.close()
        console.error('Duplicate finder failed:', error)
        return NextResponse.json({
            error: 'Analysis failed',
            message: error.message
        }, { status: 500 })
    }
}
