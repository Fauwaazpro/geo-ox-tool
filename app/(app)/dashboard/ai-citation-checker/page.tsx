"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, ArrowLeft, Search, Sparkles, AlertCircle, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface AIResult {
    engine: string
    logo: string
    isVisible: boolean
    sentiment: 'positive' | 'neutral' | 'negative'
    snippet: string
    sources: { title: string, domain: string, relevance: number }[]
    confidence: number
}

interface AnalysisData {
    visibilityScore: number
    results: AIResult[]
    recommendations: { priority: string, title: string, description: string, action: string }[]
}

export default function AICitationPage() {
    const { isPremium } = usePremium()
    const [brandName, setBrandName] = useState("")
    const [keywords, setKeywords] = useState("")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<AnalysisData | null>(null)

    const handleAnalyze = async () => {
        if (!brandName) return

        setLoading(true)
        setData(null)

        try {
            const response = await fetch('/api/ai-citation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brandName, keywords })
            })

            if (!response.ok) throw new Error('Analysis failed')

            const result = await response.json()

            // Simulate "thinking" time for realism
            setTimeout(() => {
                setData(result)
                setLoading(false)
            }, 2500)
        } catch (error) {
            console.error('Failed to analyze:', error)
            setLoading(false)
        }
    }

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return <ThumbsUp className="w-4 h-4 text-success" />
            case 'negative': return <ThumbsDown className="w-4 h-4 text-destructive" />
            default: return <Minus className="w-4 h-4 text-muted-foreground" />
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <span className="font-semibold">AI Citation Checker</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">AI Brand Visibility</h1>
                        <p className="text-muted-foreground">
                            Check how Perplexity, ChatGPT, and Gemini cite your brand
                        </p>
                    </div>

                    {/* Input Section */}
                    <Card className="border-2 border-primary/10">
                        <CardContent className="p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Brand Name</label>
                                    <Input
                                        placeholder="e.g. Your Brand"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Target Keywords (Optional)</label>
                                    <Input
                                        placeholder="e.g. spices, export, quality"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                                    />
                                </div>
                            </div>
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={handleAnalyze}
                                disabled={loading || !brandName}
                            >
                                {loading ? (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                        Querying AI Models...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5 mr-2" />
                                        Scan AI Engines
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <ToolBenefits toolSlug="ai-citation-checker" />

                    {/* Results Section */}
                    {data && (
                        <PremiumLock isLocked={!isPremium} title="Unlock AI Citation Results">
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Score Card */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <Card className="md:col-span-1 bg-slate-900 text-white border-0">
                                        <CardHeader>
                                            <CardTitle className="text-lg">GEO Score</CardTitle>
                                            <CardDescription className="text-slate-400">Total Visibility</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col items-center justify-center py-4">
                                            <div className="relative text-5xl font-bold mb-2">
                                                {data.visibilityScore}
                                                <span className="text-lg text-slate-400 font-normal">/100</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${data.visibilityScore > 75 ? 'bg-success text-white' :
                                                data.visibilityScore > 40 ? 'bg-yellow-500 text-black' :
                                                    'bg-destructive text-white'
                                                }`}>
                                                {data.visibilityScore > 75 ? 'Excellent' :
                                                    data.visibilityScore > 40 ? 'Moderate' : 'Low Visibility'}
                                            </span>
                                        </CardContent>
                                    </Card>

                                    <Card className="md:col-span-2">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Optimization Recommendations</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {data.recommendations.map((rec, i) => (
                                                <div key={i} className="flex gap-3">
                                                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-sm">{rec.title}</p>
                                                        <p className="text-xs text-muted-foreground">{rec.action}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Engine Results */}
                                <div className="grid gap-6">
                                    {data.results.map((engine, i) => (
                                        <Card key={i} className={`overflow-hidden transition-all hover:shadow-md ${engine.isVisible ? 'border-l-4 border-l-success' : 'border-l-4 border-l-destructive'
                                            }`}>
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${engine.isVisible ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                            <Bot className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg">{engine.engine}</h3>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                {engine.isVisible ? (
                                                                    <>
                                                                        <span className="text-success flex items-center gap-1">
                                                                            <Sparkles className="w-3 h-3" /> Brand Cited
                                                                        </span>
                                                                        <span>•</span>
                                                                        <span className="flex items-center gap-1">
                                                                            {getSentimentIcon(engine.sentiment)}
                                                                            {engine.sentiment.charAt(0).toUpperCase() + engine.sentiment.slice(1)} Sentiment
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-destructive">Brand Not Found</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {engine.isVisible && (
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-primary">{engine.confidence}%</div>
                                                            <div className="text-xs text-muted-foreground">Confidence</div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm leading-relaxed mb-4 relative">
                                                    {engine.isVisible && <div className="absolute top-2 left-2 text-xs text-muted-foreground select-none">AI ANSWER</div>}
                                                    <p className={engine.isVisible ? "pt-4" : "text-muted-foreground italic"}>
                                                        {engine.snippet}
                                                    </p>
                                                </div>

                                                {engine.sources && engine.sources.length > 0 && (
                                                    <div className="border-t pt-4">
                                                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Sources Cited</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {engine.sources.map((source, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 bg-background border px-2 py-1 rounded text-xs">
                                                                    <span className="truncate max-w-[150px]">{source.title}</span>
                                                                    <span className="text-muted-foreground opacity-50">({source.domain})</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </PremiumLock>
                    )}
                </div>
            </main>
        </div>
    )
}
