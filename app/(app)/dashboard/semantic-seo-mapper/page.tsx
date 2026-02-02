"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, ArrowLeft, AlertTriangle } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface Entity {
    name: string
    yourCount: number
    competitorAvg: number
    gap: number
    priority: 'high' | 'medium' | 'low'
}

export default function SemanticSEOMapperPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [keyword, setKeyword] = useState("")
    const [competitorUrl, setCompetitorUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [entities, setEntities] = useState<Entity[] | null>(null)
    const [analyzedCompetitor, setAnalyzedCompetitor] = useState("")

    const handleAnalyze = async () => {
        if (!url || !keyword) return

        setLoading(true)
        setEntities(null)
        setAnalyzedCompetitor("")

        try {
            const response = await fetch('/api/semantic-seo-mapper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, keyword, competitorUrl })
            })

            if (!response.ok) throw new Error('Analysis failed')

            const data = await response.json()
            setEntities(data.entities)
            setAnalyzedCompetitor(data.competitorUrl)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-destructive bg-destructive/10 border-destructive/30'
            case 'medium': return 'text-yellow-600 bg-yellow-600/10 border-yellow-600/30'
            case 'low': return 'text-blue-600 bg-blue-600/10 border-blue-600/30'
        }
    }

    const highPriority = entities?.filter(e => e.priority === 'high').length || 0

    // Freemium Logic
    const displayedEntities = isPremium ? entities : entities?.slice(0, 3)
    const lockedCount = entities ? entities.length - 3 : 0

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Network className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Semantic SEO Mapper</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Semantic Entity Gap Analysis</h1>
                            <p className="text-muted-foreground">
                                Find missing entities vs top competitors
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Analyze Content</CardTitle>
                                <CardDescription>Compare your semantic coverage with competitors</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Your URL</label>
                                    <Input
                                        type="url"
                                        placeholder="https://your-site.com/article"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Target Keyword</label>
                                    <Input
                                        placeholder="e.g. artificial intelligence"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Competitor URL (Optional)</label>
                                    <Input
                                        placeholder="Leave empty to auto-discover #1 rank"
                                        value={competitorUrl}
                                        onChange={(e) => setCompetitorUrl(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleAnalyze} disabled={loading || !url || !keyword}>
                                    {loading ? "Discovering & Analyzing..." : "Run Gap Analysis"}
                                </Button>
                            </CardContent>
                        </Card>

                        {entities && (
                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                        {highPriority} Critical Gaps Found
                                    </CardTitle>
                                    <CardDescription>
                                        Comparing against: <a href={analyzedCompetitor} target="_blank" className="underline text-primary truncate max-w-[200px] inline-block align-bottom">{analyzedCompetitor}</a>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {displayedEntities?.map((entity, index) => (
                                        <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(entity.priority)}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="font-medium capitalize">{entity.name}</span>
                                                <span className="text-xs px-2 py-1 rounded-full bg background border uppercase font-medium">
                                                    {entity.priority} Priority
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Your Count</p>
                                                    <p className="font-bold">{entity.yourCount}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Competitor Avg</p>
                                                    <p className="font-bold">{entity.competitorAvg}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Gap</p>
                                                    <p className="font-bold">{entity.gap}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {!isPremium && lockedCount > 0 && (
                                        <PremiumLock isLocked={true} title={`Unlock ${lockedCount} More Entities`}>
                                            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 h-32"></div>
                                        </PremiumLock>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                        <ToolBenefits toolSlug="semantic-seo-mapper" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Recommendations</h2>
                            <p className="text-muted-foreground">How to close semantic gaps</p>
                        </div>

                        {entities ? (
                            <PremiumLock isLocked={!isPremium} title="Unlock Semantic Strategies">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Priority Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {entities.filter(e => e.priority === 'high').slice(0, 3).map((entity, idx) => (
                                            <div key={idx} className="p-3 bg-surface rounded-lg">
                                                <h4 className="font-medium text-sm mb-2">Add: "{entity.name}"</h4>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    Increase mentions from {entity.yourCount} to at least {entity.competitorAvg}
                                                </p>
                                                <ul className="text-xs space-y-1">
                                                    <li>• Add dedicated section covering this topic</li>
                                                    <li>• Include in introduction and conclusion</li>
                                                    <li>• Create supporting examples and use cases</li>
                                                </ul>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Content Enhancement Tips</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary">1.</span>
                                                <span>Naturally integrate missing entities into existing content</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary">2.</span>
                                                <span>Create dedicated subsections for high-priority entities</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary">3.</span>
                                                <span>Add relevant examples,  case studies, and data</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary">4.</span>
                                                <span>Use schema markup to reinforce entity relationships</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-primary">5.</span>
                                                <span>Monitor entity coverage after updates</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Expected Impact</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Semantic Completeness:</span>
                                                <span className="font-bold text-success">+35%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Topic Authority:</span>
                                                <span className="font-bold text-success">+28%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">AI Citation Potential:</span>
                                                <span className="font-bold text-success">+42%</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </PremiumLock>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Analyze content to find semantic gaps</p>
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
