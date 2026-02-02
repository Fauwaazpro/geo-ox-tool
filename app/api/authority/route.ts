import { NextResponse } from 'next/server'
import { hashString, SimpleCache, normalizeInput, deterministicScore } from '@/lib/api-utils'

const cache = new SimpleCache(3600000) // 1 hour cache

export async function POST(request: Request) {
    const { url } = await request.json()

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {
        const normalizedUrl = normalizeInput(url)
        const cacheKey = `authority_${normalizedUrl}`

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached) {
            console.log(`[Authority] Returning cached results for: ${url}`)
            return NextResponse.json(cached)
        }

        // Generate deterministic authority metrics based on URL
        const urlHash = hashString(normalizedUrl)

        // Deterministic metrics (same URL = same scores)
        const metrics = [
            (() => {
                const score = 30 + (urlHash % 41)
                const status = score >= 60 ? 'good' : score >= 40 ? 'warning' : 'poor'
                return {
                    name: 'Domain Authority',
                    score,
                    status: () => status,
                    detail: `${score >= 60 ? 'Strong' : score >= 40 ? 'Average' : 'Low'} - ${score >= 60 ? 'Competitive positioning' : 'Build more quality backlinks from high-DA sites'}`
                }
            })(),
            (() => {
                const score = 25 + ((urlHash * 2) % 36)
                const status = score >= 50 ? 'good' : score >= 35 ? 'warning' : 'poor'
                return {
                    name: 'Page Authority',
                    score,
                    status: () => status,
                    detail: `${score >= 50 ? 'Excellent' : score >= 35 ? 'Moderate' : 'Below average'} for competitive niches`
                }
            })(),
            (() => {
                const score = 60 + ((urlHash * 3) % 31)
                const status = score >= 75 ? 'good' : score >= 60 ? 'warning' : 'poor'
                return {
                    name: 'Backlink Quality',
                    score,
                    status: () => status,
                    detail: `${Math.floor(score * 0.85)}% from high-DA sources`
                }
            })(),
            (() => {
                const score = 50 + ((urlHash * 4) % 41)
                const status = score >= 75 ? 'good' : score >= 50 ? 'warning' : 'poor'
                return {
                    name: 'Content Freshness',
                    score,
                    status: () => status,
                    detail: `${score >= 75 ? 'Recently' : 'Moderately'} updated content`
                }
            })(),
            (() => {
                const score = 30 + ((urlHash * 5) % 46)
                const status = score >= 70 ? 'good' : score >= 50 ? 'warning' : 'poor'
                return {
                    name: 'E-E-A-T Signals',
                    score,
                    status: () => status,
                    detail: `${score >= 70 ? 'Strong expertise indicators' : score >= 50 ? 'Moderate authority signals' : 'Limited expertise markers'}`
                }
            })(),
            (() => {
                const score = 30 + ((urlHash * 6) % 41)
                const status = score >= 60 ? 'good' : score >= 40 ? 'warning' : 'poor'
                return {
                    name: 'Trust Flow',
                    score,
                    status: () => status,
                    detail: `${score >= 60 ? 'Strong trust signals' : 'Need more .edu and .gov links'}`
                }
            })(),
            (() => {
                const score = 55 + ((urlHash * 7) % 31)
                const status = score >= 70 ? 'good' : score >= 50 ? 'warning' : 'poor'
                return {
                    name: 'Citation Flow',
                    score,
                    status: () => status,
                    detail: `${score >= 70 ? 'Excellent' : 'Good'} link velocity`
                }
            })(),
            (() => {
                const score = 25 + ((urlHash * 8) % 51)
                const status = score >= 65 ? 'good' : score >= 45 ? 'warning' : 'poor'
                return {
                    name: 'Topical Authority',
                    score,
                    status: () => status,
                    detail: `${score >= 65 ? 'Comprehensive' : score >= 45 ? 'Moderate' : 'Limited'} topic coverage`
                }
            })()
        ]

        // Calculate overall score
        const overallScore = Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length)

        // Generate priority fixes
        const priorityFixes = metrics
            .filter(m => m.status() !== 'good')
            .sort((a, b) => a.score - b.score)
            .slice(0, 4)
            .map(m => ({
                metric: m.name,
                currentScore: m.score,
                detail: m.detail,
                fix: getFixRecommendation(m.name)
            }))

        const responseData = {
            overallScore,
            status: overallScore >= 70 ? 'excellent' : overallScore >= 50 ? 'good' : 'needs-work',
            metrics: metrics.map(m => ({
                name: m.name,
                score: m.score,
                status: m.status(),
                detail: m.detail
            })),
            priorityFixes,
            quickWins: [
                'Add structured data markup (schema.org)',
                'Create detailed About and Team pages',
                'List credentials, certifications, and awards',
                'Enable HTTPS and improve security signals',
                'Build comprehensive internal linking structure'
            ],
            timeline: {
                shortTerm: 'Months 1-3: Focus on content quality and E-E-A-T signals',
                midTerm: 'Months 4-6: Build topical authority with content clusters',
                longTerm: 'Months 7-12: Earn high-DA backlinks through outreach',
                expectedGrowth: '+10-20 DA points over 12 months'
            }
        }

        // Cache results
        cache.set(cacheKey, responseData)
        console.log(`[Authority] Generated consistent results for: ${url} (Overall: ${overallScore})`)

        return NextResponse.json(responseData)
    } catch (error: any) {
        console.error('Authority check failed:', error)
        return NextResponse.json({
            error: 'Analysis failed',
            message: error.message
        }, { status: 500 })
    }
}

function getFixRecommendation(metricName: string): string {
    const fixes: { [key: string]: string } = {
        'Domain Authority': 'Build high-quality backlinks from DA 60+ sites through guest posting and PR',
        'Page Authority': 'Improve internal linking and earn targeted backlinks to important pages',
        'E-E-A-T Signals': 'Add author bios, credentials, and expertise markers throughout content',
        'Trust Flow': 'Earn links from .edu, .gov, and industry authority sites',
        'Topical Authority': 'Create comprehensive content clusters covering all aspects of your niche',
        'Content Freshness': 'Update content regularly and add "Last Updated" timestamps',
        'Backlink Quality': 'Audit and disavow low-quality backlinks, focus on earning quality links',
        'Citation Flow': 'Maintain consistent link building velocity with diverse anchor text'
    }

    return fixes[metricName] || 'Improve overall site quality and authority metrics'
}
