"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, ArrowLeft, Check, X, AlertTriangle } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface MobileIssue {
    type: 'error' | 'warning' | 'success'
    title: string
    description: string
    impact: string
}

export default function MobileAuditorPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<MobileIssue[] | null>(null)
    const [screenshot, setScreenshot] = useState<string | null>(null)
    const [score, setScore] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const handleAnalyze = async () => {
        if (!url) return

        setLoading(true)
        setResults(null)
        setScreenshot(null)
        setError(null)

        try {
            const response = await fetch('/api/mobile-auditor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (!response.ok) {
                throw new Error('Analysis failed')
            }

            const data = await response.json()
            setResults(data.issues)
            setScreenshot(data.screenshot)
            setScore(data.scoreDisplay)

        } catch (err: any) {
            setError(err.message || "Failed to analyze mobile performance")
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <Check className="w-5 h-5 text-success" />
            case 'error': return <X className="w-5 h-5 text-destructive" />
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
            default: return <Check className="w-5 h-5 text-success" />
        }
    }

    const getColor = (type: string) => {
        switch (type) {
            case 'success': return 'border-success/30 bg-success/5'
            case 'error': return 'border-destructive/30 bg-destructive/5'
            case 'warning': return 'border-yellow-600/30 bg-yellow-600/5'
            default: return 'border-success/30 bg-success/5'
        }
    }

    // Freemium Logic
    const displayedResults = isPremium ? results : results?.slice(0, 3)
    const lockedCount = results ? results.length - 3 : 0

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Mobile Auditor</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left - Analysis */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Mobile Usability Audit</h1>
                            <p className="text-muted-foreground">
                                Test how your site renders on mobile devices
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Test Mobile Rendering</CardTitle>
                                <CardDescription>Analyze mobile usability and tap targets</CardDescription>
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
                                        {loading ? "Testing..." : "Test"}
                                    </Button>
                                </div>
                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {results && (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>Mobile Score</span>
                                            <span className={`text-3xl font-bold ${score.startsWith('6') ? 'text-success' : 'text-primary'}`}>
                                                {score}
                                            </span>
                                        </CardTitle>
                                        <CardDescription>Checks passed</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {displayedResults?.map((issue, index) => (
                                            <div key={index} className={`p-4 rounded-lg border ${getColor(issue.type)}`}>
                                                <div className="flex items-start gap-3">
                                                    {getIcon(issue.type)}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-medium">{issue.title}</h4>
                                                            <span className="text-xs px-2 py-1 rounded-full bg-background border">
                                                                {issue.impact} Impact
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {!isPremium && lockedCount > 0 && (
                                            <PremiumLock isLocked={true} title={`Unlock ${lockedCount} More Issues`}>
                                                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 h-24"></div>
                                            </PremiumLock>
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        )}


                        <ToolBenefits toolSlug="mobile-auditor" />
                    </div>

                    {/* Right - Preview & Solutions */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Mobile Preview</h2>
                            <p className="text-muted-foreground">How your site looks on mobile</p>
                        </div>

                        {screenshot ? (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Device Preview</CardTitle>
                                        <CardDescription>iPhone 13 Pro (390 x 844)</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-center bg-slate-50 border rounded-lg p-6">
                                        <div className="relative border-4 border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl bg-black" style={{ width: '300px', height: '600px' }}>
                                            {/* Notch */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-20"></div>

                                            {/* Screen Content */}
                                            <div className="w-full h-full bg-white overflow-hidden relative">
                                                {/* Image */}
                                                <img
                                                    src={screenshot}
                                                    alt="Mobile Preview"
                                                    className="w-full h-full object-cover object-top"
                                                />
                                                {/* Shine effect */}
                                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none z-10"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <PremiumLock isLocked={!isPremium} title="Unlock Fix Recommendations">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Fix Recommendations</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="p-3 bg-surface rounded-lg">
                                                <p className="font-medium text-sm mb-1">Increase Tap Target Size</p>
                                                <pre className="text-xs bg-background p-2 rounded mt-2 overflow-x-auto">
                                                    {`button, a {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}`}
                                                </pre>
                                            </div>
                                            <div className="p-3 bg-surface rounded-lg">
                                                <p className="font-medium text-sm mb-1">Fix Horizontal Scroll</p>
                                                <pre className="text-xs bg-background p-2 rounded mt-2 overflow-x-auto">
                                                    {`body {
  max-width: 100vw;
  overflow-x: hidden;
}`}
                                                </pre>
                                            </div>
                                            <div className="p-3 bg-surface rounded-lg">
                                                <p className="font-medium text-sm mb-1">Improve Font Readability</p>
                                                <pre className="text-xs bg-background p-2 rounded mt-2 overflow-x-auto">
                                                    {`body {
  font-size: 16px;
  line-height: 1.6;
}`}
                                                </pre>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </PremiumLock>
                            </>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Test a URL to see mobile preview</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main >
        </div >
    )
}
