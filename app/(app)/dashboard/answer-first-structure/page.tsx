"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ArrowLeft, Wand2, Copy, Check } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

export default function AnswerFirstPage() {
    const { isPremium } = usePremium()
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [optimized, setOptimized] = useState("")
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [changes, setChanges] = useState<string[]>([])

    const handleOptimize = async () => {
        if (!content) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/answer-first', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            })

            if (!response.ok) {
                throw new Error('Optimization failed')
            }

            const data = await response.json()
            setOptimized(data.optimized)
            setChanges(data.changes || [
                'Added direct answer in first paragraph',
                'Restructured with clear headings',
                'Included supporting data and statistics',
                'Added concrete examples',
                'Improved scannability for AI parsing'
            ])
        } catch (err: any) {
            setError(err.message || 'Failed to optimize content')
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(optimized)
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
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Answer-First Structure Tool</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Answer-First Optimizer</h1>
                            <p className="text-muted-foreground">
                                Restructure content for AI answer engines
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Paste Original Content</CardTitle>
                                <CardDescription>We'll restructure it for AI optimization</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Paste your article or blog post here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[400px] font-mono text-sm"
                                />
                                <Button onClick={handleOptimize} disabled={loading || !content} className="w-full">
                                    {loading ? (
                                        <>
                                            <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                                            Optimizing...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            Optimize for AI
                                        </>
                                    )}
                                </Button>
                            </CardContent>

                        </Card>
                        <ToolBenefits toolSlug="answer-first-structure" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">AI-Optimized Version</h2>
                            <p className="text-muted-foreground">Answer-first structure applied</p>
                        </div>

                        {optimized ? (
                            <PremiumLock isLocked={!isPremium} title="Unlock Optimized Content">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Restructured Content</CardTitle>
                                        <CardDescription>Ready for publication</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="prose prose-sm max-w-none bg-surface p-4 rounded-lg max-h-96 overflow-auto">
                                            <pre className="text-sm whitespace-pre-wrap font-sans">{optimized}</pre>
                                        </div>
                                        <Button onClick={handleCopy} variant="outline" className="w-full">
                                            {copied ? (
                                                <><Check className="w-4 h-4 mr-2" /> Copied!</>
                                            ) : (
                                                <><Copy className="w-4 h-4 mr-2" /> Copy Optimized Content</>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">What Changed</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm">
                                            {changes.map((change, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-success">✓</span>
                                                    <span>{change}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </PremiumLock>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Paste content to optimize</p>
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
