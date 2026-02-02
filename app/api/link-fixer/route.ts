import { NextResponse } from 'next/server'
import { hashString, SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000) // 1 hour cache

export async function POST(request: Request) {
    const { url } = await request.json()

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {
        const normalizedUrl = normalizeInput(url)
        const cacheKey = `link_fixer_real_${normalizedUrl}`

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached) {
            return NextResponse.json(cached)
        }

        const baseUrl = new URL(normalizedUrl).origin

        // 1. Fetch the main page content
        let html = '';
        try {
            const res = await fetch(normalizedUrl, { headers: { 'User-Agent': 'GEO-Ox-Bot/1.0' } });
            if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
            html = await res.text();
        } catch (e: any) {
            return NextResponse.json({ error: `Could not access URL: ${e.message}` }, { status: 500 });
        }

        // 2. Extract unique links (Simple Regex for speed/robustness without heavy deps)
        const linkRegex = /href=["']([^"']+)["']/g;
        const foundLinks = new Set<string>();
        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            let href = match[1];

            // Normalize
            if (href.startsWith('/')) {
                href = `${baseUrl}${href}`;
            }

            // Filter internal only, valid http/https
            if (href.startsWith(baseUrl) && !href.includes('#') && !href.includes('mailto:') && !href.includes('tel:')) {
                foundLinks.add(href);
            }
        }

        const linksToCheck = Array.from(foundLinks).slice(0, 50); // Limit to 50 links for performance

        // 3. Check status codes in parallel
        const brokenLinks: any[] = [];

        await Promise.all(linksToCheck.map(async (link) => {
            try {
                // HEAD request is faster
                const res = await fetch(link, { method: 'HEAD', headers: { 'User-Agent': 'GEO-Ox-Bot/1.0' } });
                if (res.status >= 400) {
                    brokenLinks.push({
                        url: link,
                        statusCode: res.status,
                        statusText: res.statusText,
                        foundOn: [normalizedUrl],
                        suggestedFix: null // Cannot automatically suggest fix without AI or more context
                    });
                }
            } catch (error) {
                // Network error (DNS, timeout) -> treat as broken
                brokenLinks.push({
                    url: link,
                    statusCode: 0,
                    statusText: 'Network Error / Unreachable',
                    foundOn: [normalizedUrl],
                    suggestedFix: null
                });
            }
        }));

        // Generate redirect rules for found broken links
        const htaccessRules = brokenLinks.map(link => {
            try {
                const oldPath = new URL(link.url).pathname
                return `Redirect 301 ${oldPath} / # Fix Me`
            } catch (e) { return '' }
        }).join('\n')

        const nginxRules = brokenLinks.map(link => {
            try {
                const oldPath = new URL(link.url).pathname
                return `rewrite ^${oldPath}$ / permanent; # Fix Me`
            } catch (e) { return '' }
        }).join('\n')

        const responseData = {
            brokenLinks,
            totalBroken: brokenLinks.length,
            pagesScanned: 1, // We only scanned the entry page for links
            linksChecked: linksToCheck.length,
            redirectRules: {
                htaccess: htaccessRules,
                nginx: nginxRules
            }
        }

        cache.set(cacheKey, responseData)

        return NextResponse.json(responseData)
    } catch (error: any) {
        console.error('Link check failed:', error)
        return NextResponse.json({
            error: 'Analysis failed',
            message: error.message
        }, { status: 500 })
    }
}
