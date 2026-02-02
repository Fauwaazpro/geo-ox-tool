"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ArrowLeft, Brain, Sparkles, CheckCircle, AlertTriangle, XCircle, Globe } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface AnalysisResult {
    score: number
    metrics: {
        wordCount: number
        readingLevel: number
        uniqueDensity: string
        sentiment: string
        analysisType: string
    }
    insights: { type: 'success' | 'warning' | 'error' | 'info', text: string }[]
}

export default function AIContentScorerPage() {
    const { isPremium } = usePremium()
    const [mode, setMode] = useState<'text' | 'url'>('text')
    const [textInput, setTextInput] = useState("")
    const [urlInput, setUrlInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)

    const handleAnalyze = async () => {
        const content = mode === 'text' ? textInput : urlInput
        if (!content) return

        setLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/ai-content-scorer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: mode, content })
            })

            const data = await response.json()

            // Artificial delay for "processing" feel
            setTimeout(() => {
                setResult(data)
                setLoading(false)
            }, 1500)

        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-success"
        if (score >= 60) return "text-yellow-500"
        return "text-destructive"
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
                        <Brain className="w-5 h-5 text-primary" />
                        <span className="font-semibold">AI Content Scorer</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">Content Readability & SEO Scorer</h1>
                        <p className="text-muted-foreground">
                            Analyze your text to see if it's optimized for LLM understanding and citation.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Input */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Content Analysis</CardTitle>
                                    <CardDescription>Paste content or enter a URL</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="text" onValueChange={(v) => setMode(v as 'text' | 'url')}>
                                        <TabsList className="grid w-full grid-cols-2 mb-4">
                                            <TabsTrigger value="text"><FileText className="w-4 h-4 mr-2" /> Paste Text</TabsTrigger>
                                            <TabsTrigger value="url"><Globe className="w-4 h-4 mr-2" /> From URL</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="text" className="space-y-4">
                                            <Textarea
                                                placeholder="Paste your article, blog post, or documentation here..."
                                                className="min-h-[300px] font-mono text-sm leading-relaxed"
                                                value={textInput}
                                                onChange={(e) => setTextInput(e.target.value)}
                                            />
                                        </TabsContent>

                                        <TabsContent value="url" className="space-y-4">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="https://example.com/blog-post"
                                                    value={urlInput}
                                                    onChange={(e) => setUrlInput(e.target.value)}
                                                />
                                            </div>
                                            <div className="bg-muted/50 p-8 rounded-lg text-center text-muted-foreground border border-dashed">
                                                <Globe className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                                <p>Enter a public URL to simulate a crawl</p>
                                            </div>
                                        </TabsContent>

                                        <div className="pt-4">
                                            <Button
                                                className="w-full h-12 text-lg"
                                                onClick={handleAnalyze}
                                                disabled={loading || (mode === 'text' ? !textInput : !urlInput)}
                                            >
                                                {loading ? (
                                                    <><Sparkles className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
                                                ) : (
                                                    <><Brain className="w-5 h-5 mr-2" /> Calculate Score</>
                                                )}
                                            </Button>
                                        </div>
                                    </Tabs>

                                </CardContent>
                            </Card>
                            <ToolBenefits toolSlug="ai-content-scorer" />
                        </div>

                        {/* Right: Results */}
                        <div className="space-y-6">
                            {result ? (
                                <PremiumLock isLocked={!isPremium} title="Unlock Content Analysis">
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <Card className="border-2 border-primary/20">
                                            <CardHeader className="text-center pb-2">
                                                <CardTitle className="text-lg uppercase tracking-widest text-muted-foreground">AI Readiness Score</CardTitle>
                                            </CardHeader>
                                            <CardContent className="text-center">
                                                <div className={`text-6xl font-black mb-2 ${getScoreColor(result.score)}`}>
                                                    {result.score}
                                                </div>
                                                <div className="flex justify-center gap-2 mb-4">
                                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                                        {result.metrics.readingLevel} Grade Level
                                                    </span>
                                                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                                        {result.metrics.uniqueDensity} Unique
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground border-t pt-4">
                                                    {result.score > 80 ? "Highly noticeable by AI models." :
                                                        result.score > 60 ? "Average. Needs more depth." :
                                                            "Likely to be ignored. Too generic."}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-base">Key Insights</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {result.insights.map((insight, idx) => (
                                                    <div key={idx} className="flex gap-3 items-start text-sm">
                                                        {insight.type === 'success' && <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />}
                                                        {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />}
                                                        {insight.type === 'error' && <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />}
                                                        {insight.type === 'info' && <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                                                        <span>{insight.text}</span>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>

                                        <div className="text-xs text-center text-muted-foreground">
                                            Analysis Mode: {result.metrics.analysisType}
                                        </div>
                                    </div>
                                </PremiumLock>
                            ) : (
                                <div className="h-full flex items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground/50 text-center">
                                    <div>
                                        <Brain className="w-16 h-16 mx-auto mb-4" />
                                        <p>Results will appear here</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div >
            </main >
        </div >
    )
}
