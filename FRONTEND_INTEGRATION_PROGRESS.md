# Frontend API Integration Progress

## ✅ Completed (2/17)
1. **Technical Readiness Checker** - Connected to `/api/technical-readiness`
2. **Core Web Vitals Fixer** - Connected to `/api/vitals-fixer`

## 🔄 Pattern for Remaining Tools

Each tool needs the same simple update pattern:

### Before (Mock Data):
```typescript
const handleAnalyze = () => {
    setLoading(true)
    setTimeout(() => {
        setResults(mockData)
        setLoading(false)
    }, 1500)
}
```

### After (Real API):
```typescript
const [error, setError] = useState<string | null>(null)

const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    
    try {
        const response = await fetch('/api/ROUTE_NAME', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }) // or { content }, { domain }, etc.
        })
        
        if (!response.ok) throw new Error('Analysis failed')
        
        const data = await response.json()
        setResults(data.RESULT_KEY) // Map to component structure
    } catch (err: any) {
        setError(err.message)
    } finally {
        setLoading(false)
    }
}
```

## 📋 Remaining Tools & API Endpoints

### Infrastructure (4 remaining)
3. **Mobile Auditor** → `/api/mobile-auditor`
   - Input: `{ url }`
   - Response: `{ issues, score, screenshot, summary }`

4. **Link Fixer** → `/api/link-fixer`
   - Input: `{ url }`
   - Response: `{ brokenLinks, totalBroken, redirectRules }`

5. **JS Rendering Checker** → `/api/js-rendering`
   - Input: `{ url }`
   - Response: `{ comparison, visibilityScore, recommendations }`

6. **Schema Generator** → `/api/schema-generator`
   - Input: `{ type, data }`
   - Response: `{ schema, validation, jsonLd }`

### AI & Semantic (5 remaining)
7. **AI Citation Checker** → `/api/ai-citation`
   - Input: `{ brand }`
   - Response: `{ results, summary, recommendations }`

8. **AI Content Scorer** → `/api/ai-content-scorer`
   - Input: `{ content }`
   - Response: `{ overallScore, metrics, stats, recommendations }`

9. **llms.txt Generator** → `/api/llms-txt`
   - Input: `{ url }`
   - Response: `{ llmsTxt, metadata, preview }`

10. **Answer-First Structure** → `/api/answer-first`
    - Input: `{ content }`
    - Response: `{ original, optimized, analysis, recommendations }`

11. **LSI Keyword Extractor** → `/api/lsi-keywords`
    - Input: `{ keyword }`
    - Response: `{ lsiKeywords, contentTemplate, stats, tips }`

### Content & Audit (6 remaining)
12. **Semantic SEO Mapper** → `/api/semantic-mapper`
    - Input: `{ url }`
    - Response: `{ entities, summary, recommendations, impact }`

13. **Citation Authority Builder** → `/api/citation-builder`
    - Input: `{ domain }`
    - Response: `{ sources, actionPlan, expectedResults, metrics }`

14. **Authority Checker** → `/api/authority`
    - Input: `{ url }`
    - Response: `{ overallScore, status, metrics, priorityFixes, quickWins, timeline }`

15. **General Audit** → `/api/general-audit`
    - Input: `{ url }`
    - Response: `{ audit, summary, details }`

16. **Linking Suggester** → `/api/linking`
    - Input: `{ url }`
    - Response: `{ suggestions, summary, bestPractices }`

17. **Duplicate Finder** → `/api/duplicate`
    - Input: `{ url }`
    - Response: `{ duplicates, summary, fixes }`

## 🚀 Quick Update Script

For each file, find and replace:
1. Add `const [error, setError] = useState<string | null>(null)` to state
2. Change function to `async`
3. Replace `setTimeout(...)` with the fetch pattern above
4. Map API response fields to component expectations
5. Add error handling

---

**Status**: 2/17 complete - Continuing updates...
