import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const { type, data } = await request.json()

    if (!type) {
        return NextResponse.json({ error: 'Schema type is required' }, { status: 400 })
    }

    let schema: any = {
        "@context": "https://schema.org",
        "@type": type
    }

    // Build schema based on type
    switch (type) {
        case 'Article':
            schema = {
                ...schema,
                headline: data.headline || 'Article Headline',
                author: {
                    "@type": "Person",
                    name: data.author || 'Author Name'
                },
                datePublished: data.datePublished || new Date().toISOString(),
                dateModified: data.dateModified || new Date().toISOString(),
                image: data.image || '',
                publisher: {
                    "@type": "Organization",
                    name: data.publisherName || 'Publisher',
                    logo: {
                        "@type": "ImageObject",
                        url: data.publisherLogo || ''
                    }
                },
                description: data.description || ''
            }
            break

        case 'Product':
            schema = {
                ...schema,
                name: data.name || 'Product Name',
                description: data.description || '',
                image: data.image || '',
                brand: {
                    "@type": "Brand",
                    name: data.brand || 'Brand Name'
                },
                offers: {
                    "@type": "Offer",
                    price: data.price || '0',
                    priceCurrency: data.currency || 'USD',
                    availability: "https://schema.org/InStock"
                },
                aggregateRating: data.rating ? {
                    "@type": "AggregateRating",
                    ratingValue: data.rating,
                    reviewCount: data.reviewCount || 1
                } : undefined
            }
            break

        case 'LocalBusiness':
            schema = {
                ...schema,
                name: data.name || 'Business Name',
                description: data.description || '',
                image: data.image || '',
                address: {
                    "@type": "PostalAddress",
                    streetAddress: data.streetAddress || '',
                    addressLocality: data.city || '',
                    addressRegion: data.state || '',
                    postalCode: data.postalCode || '',
                    addressCountry: data.country || ''
                },
                telephone: data.phone || '',
                openingHours: data.hours || 'Mo-Fr 09:00-17:00'
            }
            break

        case 'Event':
            schema = {
                ...schema,
                name: data.name || 'Event Name',
                description: data.description || '',
                startDate: data.startDate || new Date().toISOString(),
                endDate: data.endDate || new Date().toISOString(),
                location: {
                    "@type": "Place",
                    name: data.locationName || 'Location',
                    address: data.address || ''
                },
                offers: {
                    "@type": "Offer",
                    price: data.price || '0',
                    priceCurrency: data.currency || 'USD',
                    availability: "https://schema.org/InStock"
                }
            }
            break

        case 'FAQ':
            schema = {
                ...schema,
                mainEntity: (data.questions || []).map((q: any) => ({
                    "@type": "Question",
                    name: q.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: q.answer
                    }
                }))
            }
            break

        default:
            return NextResponse.json({
                error: 'Unsupported schema type',
                supportedTypes: ['Article', 'Product', 'LocalBusiness', 'Event', 'FAQ']
            }, { status: 400 })
    }

    // Validate schema
    const isValid = validateSchema(schema)
    const validation = {
        isValid,
        errors: isValid ? [] : getValidationErrors(schema)
    }

    return NextResponse.json({
        schema,
        validation,
        jsonLd: JSON.stringify(schema, null, 2)
    })
}

function validateSchema(schema: any): boolean {
    // Basic validation
    if (!schema["@context"] || !schema["@type"]) {
        return false
    }

    // Type-specific validation
    switch (schema["@type"]) {
        case 'Article':
            return !!(schema.headline && schema.author && schema.datePublished)
        case 'Product':
            return !!(schema.name && schema.offers)
        case 'LocalBusiness':
            return !!(schema.name && schema.address)
        case 'Event':
            return !!(schema.name && schema.startDate && schema.location)
        case 'FAQ':
            return !!(schema.mainEntity && schema.mainEntity.length > 0)
        default:
            return true
    }
}

function getValidationErrors(schema: any): string[] {
    const errors: string[] = []

    if (!schema["@context"]) errors.push('Missing @context')
    if (!schema["@type"]) errors.push('Missing @type')

    switch (schema["@type"]) {
        case 'Article':
            if (!schema.headline) errors.push('Missing headline')
            if (!schema.author) errors.push('Missing author')
            if (!schema.datePublished) errors.push('Missing datePublished')
            break
        case 'Product':
            if (!schema.name) errors.push('Missing product name')
            if (!schema.offers) errors.push('Missing offers')
            break
        case 'LocalBusiness':
            if (!schema.name) errors.push('Missing business name')
            if (!schema.address) errors.push('Missing address')
            break
        case 'Event':
            if (!schema.name) errors.push('Missing event name')
            if (!schema.startDate) errors.push('Missing startDate')
            if (!schema.location) errors.push('Missing location')
            break
        case 'FAQ':
            if (!schema.mainEntity || schema.mainEntity.length === 0) {
                errors.push('Missing FAQ questions')
            }
            break
    }

    return errors
}
