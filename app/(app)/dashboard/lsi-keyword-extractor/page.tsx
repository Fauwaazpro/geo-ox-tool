"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowLeft, Copy, Check } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface LSIKeyword {
    keyword: string
    relevance: number
    searchVolume: string
    difficulty: string
    usage: string
}

export default function LSIKeywordPage() {
    const { isPremium } = usePremium()
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)
    const [lsiKeywords, setLsiKeywords] = useState<LSIKeyword[] | null>(null)
    const [template, setTemplate] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleExtract = async () => {
        if (!keyword) return

        setLoading(true)
        setLsiKeywords(null)
        setTemplate(null)

        try {
            const res = await fetch('/api/lsi-keywords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword })
            })

            if (res.ok) {
                const data = await res.json()
                setLsiKeywords(data.lsiKeywords)
                setTemplate(data.contentTemplate)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCopyAll = () => {
        if (!lsiKeywords) return
        const text = lsiKeywords.map(kw => kw.keyword).join('\n')
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
                        <Search className="w-5 h-5 text-primary" />
                        <span className="font-semibold">LSI Keyword Extractor</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">LSI Keyword Extraction</h1>
                            <p className="text-muted-foreground">
                                Extract real-time semantics from Google SERPs (People Also Ask, Related Searches)
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Extract LSI Keywords</CardTitle>
                                <CardDescription>Live scraping of Google Search Results</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter target keyword (e.g., SEO)"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleExtract()}
                                    />
                                    <Button onClick={handleExtract} disabled={loading || !keyword}>
                                        {loading ? "Scraping SERPs..." : "Extract Live Data"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {lsiKeywords && (
                            <PremiumLock isLocked={!isPremium} title="Unlock LSI Keywords">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{lsiKeywords.length} LSI Keywords Found</span>
                                            <Button onClick={handleCopyAll} variant="outline" size="sm">
                                                {copied ? (
                                                    <><Check className="w-4 h-4 mr-1" /> Copied</>
                                                ) : (
                                                    <><Copy className="w-4 h-4 mr-1" /> Copy All</>
                                                )}
                                            </Button>
                                        </CardTitle>
                                        <CardDescription>Semantically related terms from top ranking results</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {lsiKeywords.map((lsi, index) => (
                                            <div key={index} className="p-3 rounded-lg border bg-surface hover:bg-surface/80 transition">
                                                <div className="flex items-start justify-between mb-1">
                                                    <span className="font-medium text-sm">{lsi.keyword}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${lsi.relevance > 85 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {lsi.relevance}% Rel
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="capitalize">Source: {lsi.usage}</span>
                                                    {/* <span>Diff: {lsi.difficulty}</span> */}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </PremiumLock>
                        )}
                        <ToolBenefits toolSlug="lsi-keyword-extractor" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Implementation Guide</h2>
                            <p className="text-muted-foreground">AI-Generated Content Structure</p>
                        </div>

                        {template ? (
                            <PremiumLock isLocked={!isPremium} title="Unlock Optimized Outline">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Optimized Content Outline</CardTitle>
                                        <CardDescription>Based on People Also Ask and Related Searches</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[500px]">
                                            {template}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Tip: Use these exact headings to capture PAA snippets.
                                        </p>
                                    </CardContent>
                                </Card>
                            </PremiumLock>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Enter keyword to scrape live SERP data</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
