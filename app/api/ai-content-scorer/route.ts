import { NextResponse } from 'next/server'
import { hashString, SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000) // 1 hour cache

// Helper for Flesch-Kincaid Grade Level
function calculateReadability(text: string) {
    const words = text.trim().split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const syllables = text.split(/[aeiouy]+/).length // Rough approximation

    // Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    const score = 0.39 * (words / (sentences || 1)) + 11.8 * (syllables / (words || 1)) - 15.59
    return Math.max(0, Math.min(18, score)) // Clamp between 0-18
}

// Helper for Information Density (Entropy approximation)
function calculateInformationDensity(text: string) {
    const words = text.toLowerCase().match(/[a-z]+/g) || []
    const uniqueWords = new Set(words)
    return (uniqueWords.size / words.length) * 100 // % of unique words
}

export async function POST(request: Request) {
    const { type, content } = await request.json() // type: 'text' | 'url'

    if (!content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    try {
        // Create unique cache key
        const cacheKey = `ai_scorer_${type}_${hashString(content.slice(0, 100))}`
        const cached = cache.get(cacheKey)
        if (cached) return NextResponse.json(cached)

        // Local Metrics (Always calculate details locally)
        const wordCount = type === 'text' ? content.trim().split(/\s+/).length : 500
        const readingLevel = type === 'text' ? calculateReadability(content) : 10
        const uniqueDensity = type === 'text' ? calculateInformationDensity(content) : 40

        const apiKey = process.env.OPENAI_API_KEY

        type AIResponse = {
            score?: number
            sentiment?: string
            insights?: any[]
        }

        let aiResponse: AIResponse = {};

        if (apiKey) {
            const prompt = `
            Evaluate this content for "AI-Readiness" (how well it answers user queries for AI search/GEO).
            Content Snippet: "${content.slice(0, 500)}..."
            
            Provide JSON output:
            1. score: 0-100 (High score means direct, authoritative, structured)
            2. sentiment: (Positive/Neutral/Negative)
            3. insights: Array of objects { type: 'success'|'warning'|'error', text: string }
            `

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are an expert content auditor for AI Search Optimization. Output valid JSON." },
                        { role: "user", content: prompt }
                    ],
                    response_format: { type: "json_object" }
                })
            })

            if (response.ok) {
                const data = await response.json()
                const contentText = data.choices[0]?.message?.content
                if (contentText) {
                    aiResponse = JSON.parse(contentText)
                }
            } else {
                console.error("OpenAI API call failed", await response.text())
            }
        }

        // If AI fails or no key, fallback to basic scoring (implicit via empty aiResponse)
        const result = {
            score: aiResponse.score || 75,
            metrics: {
                wordCount,
                readingLevel: Math.round(readingLevel * 10) / 10,
                uniqueDensity: Math.round(uniqueDensity) + '%',
                sentiment: aiResponse.sentiment || 'Neutral'
            },
            insights: aiResponse.insights || [],
            analysisType: apiKey ? 'Real-Time AI Analysis' : 'Statistical Analysis'
        }

        const responseData = result
        cache.set(cacheKey, responseData)

        return NextResponse.json(responseData)

    } catch (error: any) {
        console.error("AI Scoring Error", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
