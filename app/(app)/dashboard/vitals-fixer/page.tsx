"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, ArrowLeft, Download, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface VitalsResult {
    metric: string
    score: number
    value: string
    status: 'good' | 'needs-improvement' | 'poor'
    recommendation: string
}

interface ImageResult {
    name: string;
    dimensions: string;
    currentSize: number;
    optimizedSize: number;
    savings: number;
}

export default function VitalsFixerPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<VitalsResult[] | null>(null)
    const [images, setImages] = useState<ImageResult[]>([])
    const [error, setError] = useState<string | null>(null)
    const [optimizationPackage, setOptimizationPackage] = useState<any | null>(null)

    const handleAnalyze = async () => {
        if (!url) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/vitals-fixer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (!response.ok) {
                throw new Error('Analysis failed')
            }

            const data = await response.json()

            // Map vitals from API response
            const mappedResults = Object.entries(data.vitals).map(([key, value]: [string, any]) => ({
                metric: value.label,
                score: parseFloat(value.value),
                value: value.unit ? `${value.value}${value.unit}` : value.value,
                status: value.status,
                recommendation: data.recommendations.find((r: any) => r.metric === key.toUpperCase())?.fix || 'Performing well'
            }))

            setResults(mappedResults)

            // Set optimization package
            if (data.optimizationPackage) {
                setOptimizationPackage(data.optimizationPackage)
            }

            // Map images for display
            if (data.images && data.images.length > 0) {
                setImages(data.images.map((img: any) => ({
                    name: img.name,
                    dimensions: img.dimensions,
                    currentSize: img.currentSize,
                    optimizedSize: img.optimizedSize,
                    savings: img.savings
                })))
            }
        } catch (err: any) {
            setError(err.message || 'Failed to analyze performance')
            setResults(null)
        } finally {
            setLoading(false)
        }
    }

    const downloadOptimizationPackage = () => {
        if (!optimizationPackage) return

        // Create a comprehensive optimization report
        const report = {
            url: url,
            analyzedAt: new Date().toISOString(),
            summary: optimizationPackage.summary,
            images: optimizationPackage.images,
            cssOptimizations: optimizationPackage.cssOptimizations,
            jsOptimizations: optimizationPackage.jsOptimizations,
            performanceMetrics: results?.map(r => ({
                metric: r.metric,
                value: r.value,
                status: r.status,
                recommendation: r.recommendation
            })) || [],
            instructions: {
                images: "Convert images to WebP format using tools like ImageMagick or online converters. Compress with quality 80-85 for optimal balance.",
                css: "Use CSS minifiers like cssnano or clean-css. Remove unused CSS with PurgeCSS.",
                js: "Minify JavaScript with Terser. Implement code splitting with webpack or Rollup. Use tree-shaking to remove unused code."
            }
        }

        // Convert to JSON and download
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `optimization-package-${new Date().getTime()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(downloadUrl)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return 'text-success'
            case 'needs-improvement': return 'text-yellow-600'
            case 'poor': return 'text-destructive'
            default: return 'text-muted-foreground'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'good': return <TrendingUp className="w-5 h-5 text-success" />
            case 'needs-improvement': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
            case 'poor': return <TrendingDown className="w-5 h-5 text-destructive" />
        }
    }

    const overallScore = results ? Math.round(results.reduce((acc, r) => {
        const score = r.status === 'good' ? 100 : r.status === 'needs-improvement' ? 70 : 40
        return acc + score
    }, 0) / results.length) : 0

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Gauge className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Core Web Vitals Fixer</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left - Analysis */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Core Web Vitals Analysis</h1>
                            <p className="text-muted-foreground">
                                Measure your site's performance and get optimized images
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Analyze Performance</CardTitle>
                                <CardDescription>Enter your URL to test Core Web Vitals</CardDescription>
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
                                        {loading ? "Analyzing..." : "Analyze"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {results && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>Performance Score</span>
                                            <span className={`text-3xl font-bold ${overallScore >= 90 ? 'text-success' : overallScore >= 50 ? 'text-yellow-600' : 'text-destructive'}`}>
                                                {overallScore}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {results.map((result, index) => (
                                            <div key={index} className="p-4 rounded-lg border">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(result.status)}
                                                        <span className="font-medium">{result.metric}</span>
                                                    </div>
                                                    <span className={`font-bold ${getStatusColor(result.status)}`}>
                                                        {result.value}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </>
                        )}


                        <ToolBenefits toolSlug="vitals-fixer" />
                    </div>

                    {/* Right - Solutions */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Optimization Package</h2>
                            <p className="text-muted-foreground">Download optimized assets</p>
                        </div>

                        <PremiumLock isLocked={!isPremium} title="Unlock Optimized Assets">
                            {optimizationPackage ? (
                                <>
                                    {/* Summary Card */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Optimization Summary</CardTitle>
                                            <CardDescription>
                                                Total savings across all assets
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-surface rounded-lg">
                                                    <p className="text-sm text-muted-foreground">Total Images</p>
                                                    <p className="text-2xl font-bold">{optimizationPackage.summary.totalImages}</p>
                                                </div>
                                                <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                                                    <p className="text-sm text-success">Total Savings</p>
                                                    <p className="text-2xl font-bold text-success">{optimizationPackage.summary.savingsPercentage}</p>
                                                </div>
                                                <div className="p-4 bg-surface rounded-lg">
                                                    <p className="text-sm text-muted-foreground">Current Size</p>
                                                    <p className="text-lg font-semibold">{optimizationPackage.summary.totalCurrentSize}</p>
                                                </div>
                                                <div className="p-4 bg-surface rounded-lg">
                                                    <p className="text-sm text-muted-foreground">Optimized Size</p>
                                                    <p className="text-lg font-semibold">{optimizationPackage.summary.totalOptimizedSize}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Optimized Images */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Optimized Images ({optimizationPackage.images.length})</CardTitle>
                                            <CardDescription>
                                                Converted to WebP format and compressed
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2 max-h-64 overflow-auto">
                                                {optimizationPackage.images.map((img: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{img.name}</p>
                                                            <p className="text-xs text-muted-foreground">{img.recommendation}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-muted-foreground">{img.current} → {img.optimized}</p>
                                                            <p className="text-xs text-success font-semibold">Save {img.savings}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button className="w-full" size="lg" onClick={downloadOptimizationPackage}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Optimization Package (JSON)
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 gap-6">
                                        {/* CSS Optimizations */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">CSS Optimizations</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {optimizationPackage.cssOptimizations.map((css: any, idx: number) => (
                                                        <div key={idx} className="p-3 bg-surface rounded-lg">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-sm font-medium">{css.file}</p>
                                                                <p className="text-xs text-success">-{css.savings}</p>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">{css.action}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* JS Optimizations */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">JavaScript Optimizations</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    {optimizationPackage.jsOptimizations.map((js: any, idx: number) => (
                                                        <div key={idx} className="p-3 bg-surface rounded-lg">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-sm font-medium">{js.file}</p>
                                                                <p className="text-xs text-success">-{js.savings}</p>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">{js.action}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            ) : (
                                <Card className="border-dashed">
                                    <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                        <div className="text-center">
                                            <Gauge className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Analyze a URL to see optimizations</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </PremiumLock>
                    </div>

                    {/* Quick Wins Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Wins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">1.</span>
                                    <span>Enable browser caching (add Cache-Control headers)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">2.</span>
                                    <span>Minify CSS and JavaScript files</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">3.</span>
                                    <span>Use a CDN for static assets</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">4.</span>
                                    <span>Implement lazy loading for images</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main >
        </div >
    )
}
