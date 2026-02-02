"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, ArrowLeft, AlertTriangle } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface DuplicateContent {
    url1: string
    url2: string
    similarity: number
    duplicateText: string
    recommendation: string
}

export default function DuplicateFinderPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [duplicates, setDuplicates] = useState<DuplicateContent[] | null>(null)
    const [scannedCount, setScannedCount] = useState(0)

    const handleScan = async () => {
        if (!url) return

        setLoading(true)
        setDuplicates(null)
        setScannedCount(0)

        try {
            const res = await fetch('/api/duplicate-finder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (res.ok) {
                const data = await res.json()
                setDuplicates(data.duplicates)
                setScannedCount(data.scannedCount)
            }
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
                        <Copy className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Duplicate Content Finder</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Duplicate Content Detection</h1>
                            <p className="text-muted-foreground">Find and fix duplicate content issues</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Scan Website</CardTitle>
                                <CardDescription>Detect duplicate and near-duplicate content</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleScan()}
                                    />
                                    <Button onClick={handleScan} disabled={loading || !url}>
                                        {loading ? "Scanning Pages..." : "Start Scan"}
                                    </Button>
                                </div>
                                {scannedCount > 0 && (
                                    <p className="text-xs text-muted-foreground text-center">
                                        Scanned {scannedCount} pages for content overlap.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {duplicates && duplicates.length > 0 ? (
                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                        {duplicates.length} Duplicate Issues Found
                                    </CardTitle>
                                    <CardDescription>Pages with similar or identical content</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {duplicates.slice(0, 1).map((dup, index) => (
                                        <div key={index} className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-medium text-sm">Duplicate Pair #{index + 1}</span>
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-destructive/20 text-destructive">
                                                    {dup.similarity}% Similar
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Page 1:</p>
                                                    <code className="text-xs bg-background p-2 rounded block break-all">{dup.url1}</code>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Page 2:</p>
                                                    <code className="text-xs bg-background p-2 rounded block break-all">{dup.url2}</code>
                                                </div>
                                                <div className="pt-2 border-t">
                                                    <p className="text-xs italic">"{dup.duplicateText}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {duplicates.length > 1 && (
                                        <PremiumLock isLocked={!isPremium} title={`Unlock ${duplicates.length - 1} More Duplicates`}>
                                            <div className="space-y-4">
                                                {duplicates.slice(1).map((dup, index) => (
                                                    <div key={index} className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="font-medium text-sm">Duplicate Pair #{index + 2}</span>
                                                            <span className="px-2 py-1 rounded text-xs font-bold bg-destructive/20 text-destructive">
                                                                {dup.similarity}% Similar
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">Page 1:</p>
                                                                <code className="text-xs bg-background p-2 rounded block break-all">{dup.url1}</code>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground mb-1">Page 2:</p>
                                                                <code className="text-xs bg-background p-2 rounded block break-all">{dup.url2}</code>
                                                            </div>
                                                            <div className="pt-2 border-t">
                                                                <p className="text-xs italic">"{dup.duplicateText}"</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </PremiumLock>
                                    )}

                                </CardContent>
                            </Card>
                        ) : duplicates && duplicates.length === 0 ? (
                            <Card className="border-success/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-success">
                                        <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-xs">✓</div>
                                        No Duplicates Found
                                    </CardTitle>
                                    <CardDescription>Your content appears unique across the scanned pages.</CardDescription>
                                </CardHeader>
                            </Card>
                        ) : null}
                        <ToolBenefits toolSlug="duplicate-finder" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Resolution Guide</h2>
                            <p className="text-muted-foreground">How to fix duplicates</p>
                        </div>

                        {duplicates && duplicates.length > 0 ? (
                            <>
                                <PremiumLock isLocked={!isPremium} title="Unlock Recommended Actions">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Recommended Actions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {duplicates.map((dup, idx) => (
                                                <div key={idx} className="p-3 bg-surface rounded-lg">
                                                    <p className="font-medium text-sm mb-1">Pair #{idx + 1}</p>
                                                    <p className="text-xs text-success">💡 {dup.recommendation}</p>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Fix Strategies</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="p-3 bg-surface rounded">
                                                <h4 className="font-medium text-sm mb-1">1. 301 Redirects</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Redirect duplicate page to the canonical version
                                                </p>
                                                <pre className="text-xs bg-background p-2 rounded mt-2">
                                                    Redirect 301 /old-page /canonical-page
                                                </pre>
                                            </div>
                                            <div className="p-3 bg-surface rounded">
                                                <h4 className="font-medium text-sm mb-1">2. Canonical Tags</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Tell search engines which version is primary
                                                </p>
                                                <pre className="text-xs bg-background p-2 rounded mt-2">
                                                    {`<link rel="canonical"
        href="https://example.com/main-page" />`}
                                                </pre>
                                            </div>
                                            <div className="p-3 bg-surface rounded">
                                                <h4 className="font-medium text-sm mb-1">3. Content Consolidation</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Merge duplicates into single comprehensive page
                                                </p>
                                            </div>
                                            <div className="p-3 bg-surface rounded">
                                                <h4 className="font-medium text-sm mb-1">4. noindex Tag</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Prevent duplicate from being indexed
                                                </p>
                                                <pre className="text-xs bg-background p-2 rounded mt-2">
                                                    {`<meta name="robots" content="noindex" />`}
                                                </pre>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </PremiumLock>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Why It Matters</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                <span>Search engines may pick wrong page to rank</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                <span>Link equity gets split between duplicates</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                <span>Possible ranking penalties</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                <span>Wastes crawl budget on duplicate pages</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <Copy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Scan site to find duplicates</p>
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
