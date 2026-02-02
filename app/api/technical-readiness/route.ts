import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { url } = await req.json()

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            )
        }

        // REAL Technical Checks
        const checks = []
        let passedChecks = 0

        // 1. SSL Check
        const isHttps = url.startsWith('https://')
        if (isHttps) {
            checks.push({
                name: 'SSL Certificate',
                status: 'success',
                message: 'Secured with HTTPS',
                passed: true
            })
            passedChecks++
        } else {
            checks.push({
                name: 'SSL Certificate',
                status: 'error',
                message: 'Not using HTTPS',
                passed: false
            })
        }

        // 2. Robots.txt Check (Fetch)
        const domain = new URL(url).origin
        try {
            const robotsRes = await fetch(`${domain}/robots.txt`, { method: 'HEAD' })
            if (robotsRes.ok) {
                checks.push({
                    name: 'Robots.txt',
                    status: 'success',
                    message: 'robots.txt found',
                    passed: true
                })
                passedChecks++
            } else {
                checks.push({
                    name: 'Robots.txt',
                    status: 'warning',
                    message: 'robots.txt not found',
                    passed: true // Not critical
                })
            }
        } catch (e) {
            checks.push({
                name: 'Robots.txt',
                status: 'warning',
                message: 'Could not verify robots.txt',
                passed: false
            })
        }

        // 3. Sitemap Check (Fetch standard location)
        try {
            const sitemapRes = await fetch(`${domain}/sitemap.xml`, { method: 'HEAD' })
            if (sitemapRes.ok) {
                checks.push({
                    name: 'Sitemap.xml',
                    status: 'success',
                    message: 'sitemap.xml found',
                    passed: true
                })
                passedChecks++
            } else {
                checks.push({
                    name: 'Sitemap.xml',
                    status: 'warning',
                    message: 'sitemap.xml not found at root',
                    passed: true // Might be elsewhere
                })
            }
        } catch (e) {
            checks.push({
                name: 'Sitemap.xml',
                status: 'warning',
                message: 'Could not verify sitemap.xml',
                passed: false
            })
        }

        // 4. Canonical Tag (Parse HTML)
        try {
            const htmlRes = await fetch(url)
            const html = await htmlRes.text()

            // Simple regex check for speed (faster than loading cheerio for 1 tag)
            const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)

            if (canonicalMatch) {
                checks.push({
                    name: 'Canonical Tag',
                    status: 'success',
                    message: 'Canonical tag present',
                    passed: true
                })
                passedChecks++
            } else {
                checks.push({
                    name: 'Canonical Tag',
                    status: 'error',
                    message: 'Missing canonical tag',
                    fix: `<link rel="canonical" href="${url}" />`,
                    passed: false
                })
            }
        } catch (e) {
            checks.push({
                name: 'Canonical Tag',
                status: 'error',
                message: 'Could not access page content',
                passed: false
            })
        }

        const score = Math.round((passedChecks / 4) * 100)

        return NextResponse.json({
            checks,
            score
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
