"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Code } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface CheckResult {
    name: string
    status: 'success' | 'error' | 'warning'
    message: string
    fix?: string
    code?: string
    passed?: boolean
}

export default function TechnicalReadinessPage() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<CheckResult[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { isPremium, togglePremium } = usePremium()

    const handleCheck = async () => {
        if (!url) {
            // Simple alert is fine for validation
            alert("Please enter a URL first")
            return
        }

        setLoading(true)
        setError(null)
        setResults(null)

        // Simulate network delay for effect
        setTimeout(() => {
            const mockChecks: CheckResult[] = [
                {
                    name: 'Robots.txt',
                    status: 'success',
                    message: 'robots.txt file found and accessible',
                    passed: true
                },
                {
                    name: 'Sitemap.xml',
                    status: 'warning',
                    message: 'Sitemap found but missing some pages',
                    passed: true
                },
                {
                    name: 'SSL Certificate',
                    status: 'success',
                    message: 'Valid HTTPS connection detected',
                    passed: true
                },
                {
                    name: 'Canonical Tag',
                    status: 'error',
                    message: 'Missing self-referencing canonical tag',
                    fix: `<link rel="canonical" href="${url}" />`,
                    passed: false
                }
            ]

            setResults(mockChecks)
            setLoading(false)
        }, 1500)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Technical Readiness Checker</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* DEMO TOGGLE - REMOVE IN PROD */}
                        <button
                            onClick={togglePremium}
                            className={`text-xs px-2 py-1 rounded border ${isPremium ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600'}`}
                        >
                            {isPremium ? 'Premium (Active)' : 'Free Mode'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Split Screen */}
            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Side - Input & Analysis */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Technical Readiness Check</h1>
                            <p className="text-muted-foreground">
                                Verify essential technical SEO elements and get instant fixes
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Enter URL to Analyze</CardTitle>
                                <CardDescription>
                                    Check for robots.txt, sitemap.xml, SSL, and canonical tags
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder="https://example.com"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                                        className="flex-1"
                                    />
                                    {/* Primary Button */}
                                    <Button onClick={handleCheck} disabled={loading}>
                                        {loading ? "Checking..." : "Analyze"}
                                    </Button>
                                </div>
                                {error && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                                        Error: {error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Results */}
                        {results && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Analysis Results</CardTitle>
                                    <CardDescription>
                                        {results.filter(r => r.status === 'success').length} of {results.length} checks passed
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {results.map((result, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-4 rounded-lg border"
                                        >
                                            {result.status === 'success' && (
                                                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                            )}
                                            {result.status === 'error' && (
                                                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                            )}
                                            {result.status === 'warning' && (
                                                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium">{result.name}</div>

                                                {/* CONDITIONAL BLUR FOR NON-PREMIUM ON ERRORS */}
                                                {!isPremium && (result.status === 'error' || result.status === 'warning') ? (
                                                    <div className="relative mt-1">
                                                        <div className="text-sm text-muted-foreground blur-[4px] select-none">
                                                            {result.message}
                                                        </div>
                                                        <div className="absolute inset-0 flex items-center">
                                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded border">Premium Issue</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground">{result.message}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <ToolBenefits toolSlug="technical-readiness" />
                    </div>

                    {/* Right Side - Solutions */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">One-Click Solutions</h2>
                            <p className="text-muted-foreground">
                                Copy these fixes directly to your codebase
                            </p>
                        </div>

                        <PremiumLock isLocked={!isPremium} title="Unlock One-Click Solutions">
                            <div className="space-y-6">
                                {results?.filter(r => r.fix).map((result, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Code className="w-5 h-5" />
                                                Fix: {result.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="relative">
                                                <pre className="p-4 bg-surface rounded-lg text-sm overflow-x-auto border">
                                                    <code>{result.fix}</code>
                                                </pre>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => copyToClipboard(result.fix!)}
                                                >
                                                    Copy
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Add this to your website to resolve the issue
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}

                                {!results && (
                                    <Card className="border-dashed">
                                        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                                            <div className="text-center">
                                                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p>Enter a URL to see solutions</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </PremiumLock>
                    </div>
                </div>
            </main>
        </div>
    )
}
