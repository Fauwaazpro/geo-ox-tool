import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://geo-ox.com'

    // Core static pages
    const routes = [
        '',
        '/features',
        '/pricing',
        '/login',
        '/signup',
        '/dashboard',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Tool pages (add more if needed)
    const tools = [
        'ai-citation-optimizer',
        'ai-content-scorer',
        'mobile-auditor',
        'technical-readiness',
        'link-fixer',
        'authority-checker',
        'general-audit',
        'lsi-keywords',
    ].map((tool) => ({
        url: `${baseUrl}/dashboard/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...routes, ...tools]
}
