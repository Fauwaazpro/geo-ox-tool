"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, Check, X, AlertCircle } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface AuthorityMetric {
    name: string
    score: number
    status: 'good' | 'warning' | 'poor'
    detail: string
}

export default function AuthorityCheckerPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any | null>(null)

    const handleCheck = async () => {
        if (!url) return

        setLoading(true)
        setData(null)

        try {
            const response = await fetch('/api/authority-checker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (!response.ok) throw new Error('Analysis failed')

            const result = await response.json()
            setData(result)
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
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Authority Checker (Topic Map)</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="space-y-8">
                    <div className="text-center max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">Topic Cluster Map</h1>
                        <p className="text-muted-foreground">Visualize your site's physical internal probability. Find orphans and clusters.</p>
                    </div>

                    <Card className="max-w-xl mx-auto">
                        <CardContent className="p-4 flex gap-2">
                            <Input
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <Button onClick={handleCheck} disabled={loading || !url}>
                                {loading ? "Mapping..." : "Generate Map"}
                            </Button>
                        </CardContent>
                    </Card>

                    {data && (
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <PremiumLock isLocked={!isPremium} title="Unlock Visual Site Architecture">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex justify-between">
                                                <span>Site Architecture</span>
                                                <span className="text-sm font-normal text-muted-foreground">Scanned {data.scannedCount} pages</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="h-[500px] relative border rounded-md bg-slate-50 overflow-hidden flex items-center justify-center">
                                            {/* Simple Force-Directed Graph Approximation using SVG */}
                                            <svg width="100%" height="100%" viewBox="-100 -100 200 200" className="border">
                                                <defs>
                                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                        <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                                                    </marker>
                                                </defs>
                                                {/* Links */}
                                                {data.links.map((link: any, i: number) => {
                                                    const sourceNode = data.nodes.find((n: any) => n.id === link.source)
                                                    const targetNode = data.nodes.find((n: any) => n.id === link.target)
                                                    if (!sourceNode || !targetNode) return null

                                                    const getPos = (node: any, idx: number, total: number) => {
                                                        if (node.type === 'root') return { x: 0, y: 0 }
                                                        const angle = (idx / total) * 2 * Math.PI
                                                        const r = 80
                                                        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
                                                    }

                                                    const sIdx = data.nodes.findIndex((n: any) => n.id === sourceNode.id)
                                                    const tIdx = data.nodes.findIndex((n: any) => n.id === targetNode.id)

                                                    const start = getPos(sourceNode, sIdx, data.nodes.length)
                                                    const end = getPos(targetNode, tIdx, data.nodes.length)

                                                    return (
                                                        <line
                                                            key={i}
                                                            x1={start.x} y1={start.y}
                                                            x2={end.x} y2={end.y}
                                                            stroke="#e2e8f0"
                                                            strokeWidth="1"
                                                            markerEnd="url(#arrowhead)"
                                                        />
                                                    )
                                                })}

                                                {/* Nodes */}
                                                {data.nodes.map((node: any, i: number) => {
                                                    const angle = (i / data.nodes.length) * 2 * Math.PI
                                                    const r = node.type === 'root' ? 0 : 80
                                                    const x = Math.cos(angle) * r
                                                    const y = Math.sin(angle) * r

                                                    return (
                                                        <g key={i}>
                                                            <circle
                                                                cx={x} cy={y}
                                                                r={node.type === 'root' ? 8 : (5 + Math.min(node.degree, 10))}
                                                                fill={node.type === 'root' ? '#0f172a' : node.degree === 0 ? '#ef4444' : '#3b82f6'}
                                                                className="cursor-pointer hover:opacity-80"
                                                            >
                                                                <title>{node.label} ({node.degree} links)</title>
                                                            </circle>
                                                            {node.degree === 0 && (
                                                                <text x={x} y={y - 10} fontSize="8" textAnchor="middle" fill="#ef4444">Orphan</text>
                                                            )}
                                                        </g>
                                                    )
                                                })}
                                            </svg>
                                        </CardContent>
                                        <div className="p-4 text-xs text-muted-foreground text-center">
                                            <span className="inline-block w-3 h-3 rounded-full bg-slate-900 mr-1"></span> Root
                                            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mx-2"></span> Linked Page
                                            <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-1"></span> Orphan Page
                                        </div>
                                    </Card>

                                </PremiumLock>
                                <ToolBenefits toolSlug="authority-checker" />
                            </div>

                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-destructive flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            {data.orphans.length} Orphan Pages
                                        </CardTitle>
                                        <CardDescription>Pages with NO internal links</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {data.orphans.length === 0 ? (
                                            <p className="text-sm text-success flex items-center gap-2">
                                                <Check className="w-4 h-4" /> No orphans found!
                                            </p>
                                        ) : (
                                            data.orphans.map((url: string, i: number) => (
                                                <div key={i} className="text-sm p-2 bg-destructive/5 rounded border border-destructive/20 break-all">
                                                    {new URL(url).pathname}
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Topic Clusters</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {data.clusters.slice(0, 3).map((c: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center pb-2 border-b last:border-0">
                                                <span className="font-medium capitalize">{c.name}</span>
                                                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                                                    {c.count} Pages
                                                </span>
                                            </div>
                                        ))}

                                        {data.clusters.length > 3 && (
                                            <PremiumLock isLocked={!isPremium} title={`Unlock ${data.clusters.length - 3} More Clusters`}>
                                                <div className="space-y-4">
                                                    {data.clusters.slice(3).map((c: any, i: number) => (
                                                        <div key={i} className="flex justify-between items-center pb-2 border-b last:border-0">
                                                            <span className="font-medium capitalize">{c.name}</span>
                                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                                                                {c.count} Pages
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </PremiumLock>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main >
        </div >
    )
}
