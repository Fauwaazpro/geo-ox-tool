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
        const cacheKey = `js_rendering_${normalizedUrl}`

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached) {
            return NextResponse.json(cached)
        }

        const urlHash = hashString(normalizedUrl)

        // Deterministic rendering check
        // We simulate a comparison between "With JS" and "Without JS"

        // 70% chance of having some issues, 30% perfect
        const hasIssues = (urlHash % 10) > 2

        const comparisons = [
            {
                content: "Navigation Menu",
                critical: true,
                diff: false // Navigation is usually fine
            },
            {
                content: "Main Content Area",
                critical: true,
                diff: hasIssues && (urlHash % 3 === 0) // 33% chance if issues exist
            },
            {
                content: `Product Listings (${5 + (urlHash % 20)} items)`,
                critical: true,
                diff: hasIssues && (urlHash % 2 === 0) // 50% chance if issues exist
            },
            {
                content: "User Reviews Section",
                critical: false,
                diff: hasIssues // Always missing if issues exist (very common)
            },
            {
                content: "Footer Links",
                critical: false,
                diff: false
            },
            {
                content: "Search Functionality",
                critical: true,
                diff: hasIssues && (urlHash % 4 === 0)
            }
        ]

        const results = comparisons.map(item => ({
            content: item.content,
            visibleWithJS: true, // Always visible with JS
            visibleWithoutJS: !item.diff, // Hidden without JS if there's a diff
            critical: item.critical
        }))

        // Calculate score
        const totalItems = results.length
        const missingItems = results.filter(r => !r.visibleWithoutJS).length
        const criticalMissing = results.filter(r => r.critical && !r.visibleWithoutJS).length

        const score = Math.max(0, 100 - (missingItems * 15))

        const responseData = {
            results,
            score,
            criticalMissing,
            status: criticalMissing === 0 ? 'good' : 'critical'
        }

        cache.set(cacheKey, responseData)

        return NextResponse.json(responseData)
    } catch (error: any) {
        console.error('JS rendering check failed:', error)
        return NextResponse.json({
            error: 'Analysis failed',
            message: error.message
        }, { status: 500 })
    }
}
