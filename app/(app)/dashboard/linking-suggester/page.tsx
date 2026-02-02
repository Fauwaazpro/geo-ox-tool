"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, ArrowLeft, TrendingUp } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface LinkSuggestion {
    sourcePageTitle: string
    sourcePage: string
    targetPage: string
    anchorText: string
    context: string
    relevanceScore: number
}

export default function LinkingSuggesterPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("") // Source Page
    const [domain, setDomain] = useState("") // Root Domain (for discovery)
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState<LinkSuggestion[] | null>(null)

    const handleAnalyze = async () => {
        if (!url) return

        // Auto-infer domain if not provided
        const targetDomain = domain || new URL(url).origin

        setLoading(true)
        setSuggestions(null)

        try {
            const response = await fetch('/api/linking-suggester', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, domain: targetDomain })
            })

            if (!response.ok) throw new Error('Analysis failed')

            const data = await response.json()
            setSuggestions(data.suggestions)
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
                        <Link2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Linking Suggester</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Internal Linking Suggestions</h1>
                            <p className="text-muted-foreground">AI-powered internal link discovery</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Analyze Site</CardTitle>
                                <CardDescription>Find internal linking opportunities</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Page to Edit (Source)</label>
                                    <Input
                                        type="url"
                                        placeholder="https://yoursite.com/blog/new-post"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase">Site Root (Discovery)</label>
                                    <Input
                                        type="url"
                                        placeholder="https://yoursite.com (Optional)"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                    />
                                    <p className="text-[10px] text-muted-foreground">We crawl this to find destinations to link TO.</p>
                                </div>
                                <Button className="w-full" onClick={handleAnalyze} disabled={loading || !url}>
                                    {loading ? "Crawling & Matching..." : "Find Link Opportunities"}
                                </Button>
                            </CardContent>
                        </Card>

                        {suggestions && (
                            <PremiumLock isLocked={!isPremium} title="Unlock Link Opportunities">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{suggestions.length} Link Opportunities</span>
                                            <TrendingUp className="w-5 h-5 text-success" />
                                        </CardTitle>
                                        <CardDescription>High-relevance internal links to add</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {suggestions.map((suggestion, index) => (
                                            <div key={index} className="p-4 rounded-lg border bg-surface">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium text-sm">{suggestion.sourcePageTitle}</h4>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                                        {suggestion.relevanceScore}% match
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-xs">
                                                    <div>
                                                        <span className="text-muted-foreground">From: </span>
                                                        <code className="text-primary">{suggestion.sourcePage}</code>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">To: </span>
                                                        <code className="text-success">{suggestion.targetPage}</code>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Anchor: </span>
                                                        <span className="font-medium">{suggestion.anchorText}</span>
                                                    </div>
                                                    <div className="pt-2 border-t">
                                                        <span className="text-muted-foreground italic">{suggestion.context}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </PremiumLock>
                        )}
                        <ToolBenefits toolSlug="linking-suggester" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Implementation Guide</h2>
                            <p className="text-muted-foreground">How to add these links</p>
                        </div>

                        {suggestions ? (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Why Internal Linking Matters</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2">
                                                <span className="text-success">✓</span>
                                                <span>Helps search engines discover and index pages</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-success">✓</span>
                                                <span>Distributes page authority throughout your site</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-success">✓</span>
                                                <span>Improves user navigation and engagement</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-success">✓</span>
                                                <span>Signals page relationships and topic clusters</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-success">✓</span>
                                                <span>Reduces bounce rate and increases time on site</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <PremiumLock isLocked={!isPremium} title="Unlock Best Practices">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Best Practices</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3 text-sm">
                                                <div className="p-3 bg-surface rounded">
                                                    <p className="font-medium mb-1">1. Use Descriptive Anchor Text</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Avoid "click here" - use keyword-rich, contextual anchors
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-surface rounded">
                                                    <p className="font-medium mb-1">2. Keep Links Contextually Relevant</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Only link when it adds value to the user's journey
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-surface rounded">
                                                    <p className="font-medium mb-1">3. Don't Overdo It</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        3-5 internal links per 1,000 words is ideal
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-surface rounded">
                                                    <p className="font-medium mb-1">4. Link to Important Pages</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Prioritize high-value pages that need authority
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Expected Impact</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Pages per session:</span>
                                                    <span className="font-bold text-success">+25%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Time on site:</span>
                                                    <span className="font-bold text-success">+18%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Bounce rate:</span>
                                                    <span className="font-bold text-success">-15%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Page authority:</span>
                                                    <span className="font-bold text-success">+10-15</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </PremiumLock>
                            </>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Analyze site to find link opportunities</p>
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
