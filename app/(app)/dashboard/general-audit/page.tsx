"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, ArrowLeft, AlertTriangle, Check, X } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface AuditItem {
    category: string
    passed: number
    total: number
    issues: string[]
}

export default function GeneralAuditPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [keyword, setKeyword] = useState("")
    const [competitorUrl, setCompetitorUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any | null>(null)

    const handleAudit = async () => {
        if (!url || (!keyword && !competitorUrl)) return

        setLoading(true)
        setData(null)

        try {
            const response = await fetch('/api/general-audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, keyword, competitorUrl })
            })

            if (!response.ok) throw new Error('Audit failed')
            setData(await response.json())
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const metrics = data ? [
        { label: 'Word Count', user: data.user.wordCount, comp: data.competitor?.wordCount, unit: 'words' },
        { label: 'H2 Headings', user: data.user.h2Count, comp: data.competitor?.h2Count, unit: 'tags' },
        { label: 'Internal Links', user: data.user.internalLinkCount, comp: data.competitor?.internalLinkCount, unit: 'links' },
        { label: 'Images', user: data.user.imageCount, comp: data.competitor?.imageCount, unit: 'imgs' }
    ] : []

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        <span className="font-semibold">General Audit & Gap Analysis</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="space-y-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">Beat Your Competitors</h1>
                        <p className="text-muted-foreground">Compare your page against a competitor or the #1 ranking result.</p>
                    </div>

                    <Card className="max-w-xl mx-auto">
                        <CardContent className="p-4 space-y-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Your URL</label>
                                <Input
                                    type="url"
                                    placeholder="https://yoursite.com/page"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Target Keyword</label>
                                    <Input
                                        placeholder="e.g. best seo tools"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">Leave blank if providing competitor below</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Competitor URL (Optional)</label>
                                    <Input
                                        placeholder="https://rival.com/page"
                                        value={competitorUrl}
                                        onChange={(e) => setCompetitorUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button className="w-full" onClick={handleAudit} disabled={loading || !url || (!keyword && !competitorUrl)}>
                                {loading ? "Analyzing Competition..." : "Run Gap Analysis"}
                            </Button>
                        </CardContent>
                    </Card>

                    {data && (
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Metric Comparison</CardTitle>
                                        <CardDescription>You vs. {data.competitor ? new URL(data.competitor.url).hostname : 'Competitor'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Visible First Metric */}
                                        {[metrics[0]].map((metric, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{metric.label}</span>
                                                    <div className="flex gap-4 font-medium">
                                                        <span className={metric.user < (metric.comp || 0) ? 'text-destructive' : 'text-success'}>You: {metric.user}</span>
                                                        <span className="text-muted-foreground">Them: {metric.comp || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                                    <div className="h-full bg-blue-500" style={{ width: `${(metric.user / ((metric.user + (metric.comp || 0)) || 1)) * 100}%` }} />
                                                    <div className="h-full bg-slate-300" style={{ width: `${((metric.comp || 0) / ((metric.user + (metric.comp || 0)) || 1)) * 100}%` }} />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Locked Metrics */}
                                        <PremiumLock isLocked={!isPremium} title="Unlock All Comparisons">
                                            <div className="space-y-4">
                                                {metrics.slice(1).map((metric, i) => (
                                                    <div key={i} className="flex flex-col gap-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">{metric.label}</span>
                                                            <div className="flex gap-4 font-medium">
                                                                <span className={metric.user < (metric.comp || 0) ? 'text-destructive' : 'text-success'}>You: {metric.user}</span>
                                                                <span className="text-muted-foreground">Them: {metric.comp || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                                            <div className="h-full bg-blue-500" style={{ width: `${(metric.user / ((metric.user + (metric.comp || 0)) || 1)) * 100}%` }} />
                                                            <div className="h-full bg-slate-300" style={{ width: `${((metric.comp || 0) / ((metric.user + (metric.comp || 0)) || 1)) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </PremiumLock>
                                    </CardContent>
                                </Card>

                                <PremiumLock isLocked={!isPremium} title="Unlock Heading Analysis">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Heading Structure Gap</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-blue-50/50 rounded border border-blue-100">
                                                    <h4 className="font-bold text-blue-800 text-sm mb-2">Your Headings</h4>
                                                    <ul className="text-xs space-y-1 text-slate-600">
                                                        {data.user.h2s.slice(0, 5).map((h: string, i: number) => <li key={i}>• {h}</li>)}
                                                        {data.user.h2s.length > 5 && <li>...and {data.user.h2s.length - 5} more</li>}
                                                    </ul>
                                                </div>
                                                <div className="p-3 bg-purple-50/50 rounded border border-purple-100">
                                                    <h4 className="font-bold text-purple-800 text-sm mb-2">Their Headings</h4>
                                                    <ul className="text-xs space-y-1 text-slate-600">
                                                        {data.competitor?.h2s.slice(0, 5).map((h: string, i: number) => <li key={i}>• {h}</li>)}
                                                        {data.competitor?.h2s.length > 5 && <li>...and {data.competitor.h2s.length - 5} more</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                </PremiumLock>
                                <ToolBenefits toolSlug="general-audit" />
                            </div>

                            <div className="space-y-6">
                                <PremiumLock isLocked={!isPremium} title="Unlock Content Gaps">
                                    <Card className="border-destructive/20 bg-destructive/5">
                                        <CardHeader>
                                            <CardTitle className="text-destructive flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5" />
                                                Content Gaps Found
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {data.gaps.length > 0 ? data.gaps.map((gap: any, i: number) => (
                                                <div key={i} className="bg-white p-3 rounded border border-destructive/10 shadow-sm">
                                                    <h4 className="font-bold text-sm text-slate-900">{gap.category}: {gap.issue}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">{gap.detail}</p>
                                                </div>
                                            )) : (
                                                <p className="text-success text-sm flex items-center gap-2">
                                                    <Check className="w-4 h-4" /> You are ahead of the competition!
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </PremiumLock>

                                {data.competitor && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>About the Competitor</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm space-y-2">
                                            <p><strong>URL:</strong> <a href={data.competitor.url} target="_blank" className="text-blue-600 hover:underline break-all">{data.competitor.url}</a></p>
                                            <p><strong>Page Title:</strong> {data.competitor.title}</p>
                                            <p className="text-muted-foreground italic">"{data.competitor.description}"</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main >
        </div >
    )
}
