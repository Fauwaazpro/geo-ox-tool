"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link as LinkIcon, ArrowLeft, Download, Copy, Check } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface BrokenLink {
    url: string
    statusCode: number
    foundOn: string[]
    suggestedFix: string
}

export default function LinkFixerPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [brokenLinks, setBrokenLinks] = useState<BrokenLink[] | null>(null)
    const [copied, setCopied] = useState(false)

    const handleAnalyze = async () => {
        if (!url) return

        setLoading(true)
        setBrokenLinks(null)

        try {
            const response = await fetch('/api/link-fixer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (!response.ok) {
                throw new Error('Analysis failed')
            }

            const data = await response.json()
            setBrokenLinks(data.brokenLinks)
        } catch (error) {
            console.error('Failed to analyze:', error)
            // Fallback for demo/error purposes if API fails
            setBrokenLinks([])
        } finally {
            setLoading(false)
        }
    }

    const generateRedirectRules = () => {
        if (!brokenLinks) return ""

        return brokenLinks.map(link =>
            `Redirect 301 ${link.url} ${link.suggestedFix}`
        ).join('\n')
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generateRedirectRules())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Freemium Logic
    const displayedLinks = isPremium ? brokenLinks : brokenLinks?.slice(0, 2)
    const lockedCount = brokenLinks ? brokenLinks.length - 2 : 0

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Link Fixer (404 Resolver)</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left - Analysis */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Broken Link Detector</h1>
                            <p className="text-muted-foreground">
                                Find and fix 404 errors automatically
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Crawl for Broken Links</CardTitle>
                                <CardDescription>Scan your site for 404 and dead links</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                                    />
                                    <Button onClick={handleAnalyze} disabled={loading || !url}>
                                        {loading ? "Crawling..." : "Crawl"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {brokenLinks && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Broken Links Found</span>
                                        <span className="text-2xl font-bold text-destructive">
                                            {brokenLinks.length}
                                        </span>
                                    </CardTitle>
                                    <CardDescription>Issues detected during crawl</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {displayedLinks?.map((link, index) => (
                                        <div key={index} className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                                            <div className="flex items-start justify-between mb-2">
                                                <code className="text-sm font-mono font-medium text-destructive">
                                                    {link.url}
                                                </code>
                                                <span className="px-2 py-1 rounded text-xs bg-destructive text-white font-medium">
                                                    {link.statusCode}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs text-muted-foregrounden font-medium mb-1">
                                                        Found on {link.foundOn.length} pages:
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {link.foundOn.map((page, idx) => (
                                                            <span key={idx} className="text-xs px-2 py-1 bg-background rounded border">
                                                                {page}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t">
                                                    <p className="text-xs text-muted-foreground mb-1">Suggested redirect:</p>
                                                    <code className="text-xs font-mono text-success bg-success/10 px-2 py-1 rounded">
                                                        {link.suggestedFix}
                                                    </code>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {!isPremium && lockedCount > 0 && (
                                        <PremiumLock isLocked={true} title={`Unlock ${lockedCount} More Broken Links`}>
                                            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 h-32"></div>
                                        </PremiumLock>
                                    )}
                                </CardContent>
                            </Card>

                        )}
                        <ToolBenefits toolSlug="link-fixer" />
                    </div>

                    {/* Right - Solutions */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Auto-Generated Redirects</h2>
                            <p className="text-muted-foreground">301 redirect rules ready to implement</p>
                        </div>

                        {brokenLinks ? (
                            <>
                                <PremiumLock isLocked={!isPremium} title="Unlock Auto-Redirects">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">.htaccess Rules</CardTitle>
                                            <CardDescription>Apache redirect rules</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <pre className="text-sm bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                                                {generateRedirectRules()}
                                            </pre>
                                            <div className="flex gap-2">
                                                <Button onClick={handleCopy} variant="outline" className="flex-1">
                                                    {copied ? (
                                                        <><Check className="w-4 h-4 mr-2" /> Copied!</>
                                                    ) : (
                                                        <><Copy className="w-4 h-4 mr-2" /> Copy Rules</>
                                                    )}
                                                </Button>
                                                <Button variant="outline">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download .htaccess
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Nginx Configuration</CardTitle>
                                            <CardDescription>For Nginx servers</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <pre className="text-sm bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                                                {brokenLinks.map(link =>
                                                    `rewrite ^${link.url}$ ${link.suggestedFix} permanent;`
                                                ).join('\n')}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                </PremiumLock>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Implementation Steps</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ol className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2">
                                                <span className="font-bold text-primary">1.</span>
                                                <span>Copy the redirect rules above</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="font-bold text-primary">2.</span>
                                                <span>Add to your .htaccess file (Apache) or nginx.conf (Nginx)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="font-bold text-primary">3.</span>
                                                <span>Test redirects using curl or browser</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="font-bold text-primary">4.</span>
                                                <span>Monitor server logs for 404 errors</span>
                                            </li>
                                        </ol>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Crawl a site to generate redirect rules</p>
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
