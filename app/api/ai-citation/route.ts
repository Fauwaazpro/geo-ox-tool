import { NextResponse } from 'next/server'
import { hashString, SimpleCache, normalizeInput } from '@/lib/api-utils'

const cache = new SimpleCache(3600000) // 1 hour cache

export async function POST(request: Request) {
    const { brandName, keywords } = await request.json()

    if (!brandName) {
        return NextResponse.json({ error: 'Brand name is required' }, { status: 400 })
    }

    try {
        const normalizedBrand = normalizeInput(brandName)
        const normalizedKeywords = normalizeInput(keywords || '')
        const cacheKey = `ai_citation_${normalizedBrand}_${normalizedKeywords}_v2`

        // Check cache
        const cached = cache.get(cacheKey)
        if (cached) {
            return NextResponse.json(cached)
        }

        const openAiKey = process.env.OPENAI_API_KEY
        const anthropicKey = process.env.ANTHROPIC_API_KEY

        if (!openAiKey) {
            throw new Error("Missing OpenAI API Key")
        }

        const systemPrompt = "You are a GEO (Generative Engine Optimization) expert. Output valid JSON only."

        // 1. OpenAI Prompt: Simulate Perplexity and ChatGPT
        const openAiPrompt = `
        Analyze the brand "${brandName}" in the context of "${keywords || 'general industry'}". 
        Simulate how this brand appears in:
        1. Perplexity AI
        2. ChatGPT
        
        Provide JSON output with this structure:
        {
          "results": [
             { "engine": "Perplexity AI", "isVisible": boolean, "sentiment": "positive"|"neutral"|"negative", "snippet": "...", "sources": [{"title": "...", "domain": "..."}] },
             { "engine": "ChatGPT", "isVisible": boolean, "sentiment": "positive"|"neutral"|"negative", "snippet": "..." }
          ],
          "recommendations": [ { "priority": "high"|"medium"|"low", "title": "...", "description": "...", "action": "..." } ]
        }
        `

        // 2. Anthropic Prompt: Real Claude Analysis
        const anthropicPrompt = `
        Do you know the brand "${brandName}" in the industry of "${keywords || 'business'}"? 
        If you know it, provide a short summary of how you would cite it.
        
        Output purely valid JSON (no intro text) with this structure:
        {
          "engine": "Claude",
          "isVisible": boolean, 
          "sentiment": "positive"|"neutral"|"negative",
          "snippet": "Your actual knowledge cutoff summary of the brand...",
          "confidence": number (0-100)
        }
        `

        // Execute Requests in Parallel
        const [openAiResponse, anthropicResponse] = await Promise.allSettled([
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAiKey}` },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: openAiPrompt }],
                    response_format: { type: "json_object" }
                })
            }),
            anthropicKey ? fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': anthropicKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1024,
                    messages: [{ role: "user", content: anthropicPrompt }]
                })
            }) : Promise.resolve(null)
        ])

        // Process OpenAI Results
        let aiResults: any[] = []
        let recommendations: any[] = []

        if (openAiResponse.status === 'fulfilled' && openAiResponse.value.ok) {
            const data = await openAiResponse.value.json()
            const content = JSON.parse(data.choices[0]?.message?.content || '{}')
            aiResults = content.results || []
            recommendations = content.recommendations || []
        } else {
            console.error("OpenAI Failed", openAiResponse)
            aiResults.push(
                { engine: "Perplexity AI", isVisible: false, sentiment: "neutral", snippet: "Analysis unavailable" },
                { engine: "ChatGPT", isVisible: false, sentiment: "neutral", snippet: "Analysis unavailable" }
            )
        }

        // Process Anthropic Results
        if (anthropicResponse.status === 'fulfilled' && anthropicResponse.value && anthropicResponse.value.ok) {
            const data = await anthropicResponse.value.json()
            // Claude sometimes puts text in data.content[0].text
            const text = data.content?.[0]?.text || '{}'
            // Extract JSON if mixed with text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const claudeJson = jsonMatch ? JSON.parse(jsonMatch[0]) : { isVisible: false, snippet: "Could not parse Claude response" }

            aiResults.push({
                ...claudeJson,
                engine: "Claude",
                logo: "anthropic"
            })
        } else if (anthropicKey) {
            console.error("Anthropic Failed", anthropicResponse)
            aiResults.push({ engine: "Claude", isVisible: false, sentiment: "neutral", snippet: "Real-time check failed", logo: "anthropic" })
        } else {
            // Mock Claude if no key (though we have it now)
            aiResults.push({ engine: "Claude", isVisible: false, sentiment: "neutral", snippet: "API Key missing", logo: "anthropic" })
        }

        // Calculate aggregate visibility score
        const visibleCount = aiResults.filter(r => r.isVisible).length
        const visibilityScore = Math.round((visibleCount / aiResults.length) * 100)

        // Enhance results with logos
        const enginesMap: Record<string, string> = {
            "Perplexity AI": "perplexity",
            "ChatGPT": "chatgpt",
            "Claude": "anthropic"
        }

        const enhancedResults = aiResults.map((r: any) => ({
            ...r,
            logo: enginesMap[r.engine] || 'default',
            confidence: r.isVisible ? 85 : 0
        }))

        const responseData = {
            visibilityScore,
            results: enhancedResults,
            recommendations,
            analyzedAt: new Date().toISOString()
        }

        cache.set(cacheKey, responseData)

        return NextResponse.json(responseData)
    } catch (error: any) {
        console.error('AI citation check failed:', error)

        return NextResponse.json({
            error: 'Analysis failed',
            message: error.message || 'Real-time analysis unavailable.'
        }, { status: 500 })
    }
}
