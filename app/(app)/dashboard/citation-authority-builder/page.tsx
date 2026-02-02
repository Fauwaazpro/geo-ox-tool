"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ArrowLeft } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface BacklinkSource {
    domain: string
    authority: number
    type: string
    opportunity: string
}

export default function CitationAuthorityPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [brandName, setBrandName] = useState("")
    const [loading, setLoading] = useState(false)
    const [opportunities, setOpportunities] = useState<any[] | null>(null)

    const handleAnalyze = async () => {
        if (!url || !brandName) return

        setLoading(true)
        setOpportunities(null)

        try {
            const response = await fetch('/api/citation-authority', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, brandName })
            })

            if (!response.ok) throw new Error('Analysis failed')

            const data = await response.json()
            setOpportunities(data.opportunities)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
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
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Citation Authority Builder</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Build Citation Authority</h1>
                            <p className="text-muted-foreground">Find unlinked brand mentions on your site</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Find Opportunities</CardTitle>
                                <CardDescription>Scan content for unlinked mentions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Website URL to Scan</label>
                                    <Input
                                        placeholder="https://yourdomain.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Brand Name to Find</label>
                                    <Input
                                        placeholder="e.g. GEO Ox"
                                        value={brandName}
                                        onChange={(e) => setBrandName(e.target.value)}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleAnalyze} disabled={loading || !url || !brandName}>
                                    {loading ? "Scanning Content..." : "Find Unlinked Mentions"}
                                </Button>
                            </CardContent>
                        </Card>

                        {opportunities && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{opportunities.length} Unlinked Mentions Found</CardTitle>
                                    <CardDescription>Internal link opportunities</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Visible Opportunities (First 3) */}
                                    {opportunities.slice(0, 3).map((opp, index) => (
                                        <div key={index} className="p-4 rounded-lg border bg-surface">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-medium text-blue-600 truncate max-w-[200px]">{opp.domain}</h4>
                                                    <p className="text-xs text-muted-foreground">Found on page</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">Unlinked</div>
                                                </div>
                                            </div>
                                            <p className="text-sm italic text-muted-foreground mb-2">"{opp.context}"</p>
                                            <a href={opp.pageUrl} target="_blank" className="text-xs flex items-center gap-1 hover:underline">
                                                View Page ↗
                                            </a>
                                        </div>
                                    ))}

                                    {/* Locked Opportunities (Rest) */}
                                    {opportunities.length > 3 && (
                                        <PremiumLock isLocked={!isPremium} title={`Unlock ${opportunities.length - 3} More Opportunities`}>
                                            <div className="space-y-3">
                                                {opportunities.slice(3).map((opp, index) => (
                                                    <div key={index} className="p-4 rounded-lg border bg-surface">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-medium text-blue-600 truncate max-w-[200px]">{opp.domain}</h4>
                                                                <p className="text-xs text-muted-foreground">Found on page</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">Unlinked</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm italic text-muted-foreground mb-2">"{opp.context}"</p>
                                                        <a href={opp.pageUrl} target="_blank" className="text-xs flex items-center gap-1 hover:underline">
                                                            View Page ↗
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </PremiumLock>
                                    )}

                                    {opportunities.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No unlinked mentions found!</p>
                                            <p className="text-sm">Great job, your internal linking is solid.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                        )}
                        <ToolBenefits toolSlug="citation-authority-builder" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Action Plan</h2>
                            <p className="text-muted-foreground">How to fix unlinked mentions</p>
                        </div>

                        {opportunities ? (
                            <PremiumLock isLocked={!isPremium} title="Unlock Action Plan">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Linking Strategy</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                                            <h4 className="font-medium mb-2">Step 1: Context Match</h4>
                                            <p className="text-sm">Review each unlinked mention. Ensure the context is relevant to the page you want to rank.</p>
                                        </div>
                                        <div className="p-4 bg-surface rounded-lg border">
                                            <h4 className="font-medium mb-2">Step 2: Add Links</h4>
                                            <p className="text-sm">Log into your CMS and add the hyperlink to the relevant text anchor.</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Predicted Boost</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Internal PageRank</span>
                                            <span className="font-bold text-success">High Impact</span>
                                        </div>
                                        <div className="w-full bg-surface rounded-full h-2">
                                            <div className="bg-success h-2 rounded-full" style={{ width: '80%' }} />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-4">
                                            Internal links help Google discover and rank your deep pages.
                                        </p>
                                    </CardContent>
                                </Card>
                            </PremiumLock>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Enter details to find opportunities</p>
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
