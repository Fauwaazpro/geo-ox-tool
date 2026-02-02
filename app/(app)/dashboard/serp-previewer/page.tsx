"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, ArrowLeft, Smartphone, Monitor, Globe, Search } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

export default function SERPPreviewerPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState(0)

    // Calculate SEO Score dynamically
    useEffect(() => {
        let newScore = 0
        let checks = 0

        // 1. Title Length (Optimal: 40-60)
        if (title.length >= 40 && title.length <= 60) newScore += 20
        else if (title.length >= 30 && title.length < 40) newScore += 10
        else if (title.length > 60) newScore += 5 // Better long than short, but truncated
        checks++

        // 2. Description Length (Optimal: 120-160)
        if (description.length >= 120 && description.length <= 160) newScore += 20
        else if (description.length >= 100 && description.length < 120) newScore += 10
        else if (description.length > 160) newScore += 10
        checks++

        // 3. Keyword Usage
        if (keyword) {
            const normalizedKeyword = keyword.toLowerCase()
            const titleLower = title.toLowerCase()
            const descLower = description.toLowerCase()

            if (titleLower.includes(normalizedKeyword)) newScore += 30
            if (descLower.includes(normalizedKeyword)) newScore += 20

            // Bonus: Keyword at start of title
            if (titleLower.startsWith(normalizedKeyword)) newScore += 10
        } else {
            // If no keyword, assume 50% for potential
            newScore += 30
        }

        setScore(Math.min(100, newScore))
    }, [title, description, keyword])

    const fetchMetaData = async () => {
        if (!url) return
        setLoading(true)
        try {
            const res = await fetch('/api/serp-previewer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })
            if (res.ok) {
                const data = await res.json()
                setTitle(data.title || '')
                setDescription(data.description || '')
            }
        } catch (e) {
            console.error(e)
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
                        <Eye className="w-5 h-5 text-primary" />
                        <span className="font-semibold">SERP Previewer</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Google SERP Simulator</h1>
                            <p className="text-muted-foreground">Optimize your click-through rates with real-time preview.</p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Editor</CardTitle>
                                <CardDescription>Fetch from live URL or enter manually</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="https://example.com/page"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={fetchMetaData} disabled={loading || !url} variant="outline">
                                        {loading ? "Fetching..." : "Fetch"}
                                    </Button>
                                </div>

                                <div className="h-px bg-border my-4" />

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium">Target Keyword</label>
                                        <span className={title.toLowerCase().includes(keyword.toLowerCase()) && keyword ? "text-success text-xs" : "text-muted-foreground text-xs"}>
                                            {keyword && (title.toLowerCase().includes(keyword.toLowerCase()) ? "Found in Title" : "Missing in Title")}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            placeholder="e.g. digital marketing"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium">SEO Title</label>
                                        <span className={`text-xs ${title.length > 60 ? 'text-destructive' : 'text-muted-foreground'}`}>{title.length}px / ~60chars</span>
                                    </div>
                                    <Input
                                        placeholder="Page Title | Brand Name"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <div className="mt-1 h-1 w-full bg-slate-100 rounded overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${title.length > 60 ? 'bg-destructive' : title.length > 50 ? 'bg-success' : 'bg-blue-400'}`}
                                            style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium">Meta Description</label>
                                        <span className={`text-xs ${description.length > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>{description.length}px / ~160chars</span>
                                    </div>
                                    <Textarea
                                        placeholder="Brief summary of the page content..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="h-24"
                                    />
                                    <div className="mt-1 h-1 w-full bg-slate-100 rounded overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${description.length > 160 ? 'bg-destructive' : description.length > 120 ? 'bg-success' : 'bg-blue-400'}`}
                                            style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <PremiumLock isLocked={!isPremium} title="Unlock Optimization Score">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex justify-between">
                                        <span>Optimization Score</span>
                                        <span className={`font-bold ${score >= 80 ? 'text-success' : score >= 50 ? 'text-yellow-600' : 'text-destructive'}`}>{score}/100</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="w-full bg-surface h-3 rounded-full overflow-hidden border">
                                            <div
                                                className={`h-full transition-all duration-500 ${score >= 80 ? 'bg-success' : score >= 50 ? 'bg-yellow-500' : 'bg-destructive'}`}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className={title.length >= 40 && title.length <= 60 ? "text-success flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                                                <div className={`w-2 h-2 rounded-full ${title.length >= 40 && title.length <= 60 ? "bg-success" : "bg-slate-300"}`} />
                                                Title Width
                                            </div>
                                            <div className={keyword && title.toLowerCase().includes(keyword.toLowerCase()) ? "text-success flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                                                <div className={`w-2 h-2 rounded-full ${keyword && title.toLowerCase().includes(keyword.toLowerCase()) ? "bg-success" : "bg-slate-300"}`} />
                                                Title Keyword
                                            </div>
                                            <div className={description.length >= 120 && description.length <= 160 ? "text-success flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                                                <div className={`w-2 h-2 rounded-full ${description.length >= 120 && description.length <= 160 ? "bg-success" : "bg-slate-300"}`} />
                                                Desc. Width
                                            </div>
                                            <div className={keyword && description.toLowerCase().includes(keyword.toLowerCase()) ? "text-success flex items-center gap-1" : "text-muted-foreground flex items-center gap-1"}>
                                                <div className={`w-2 h-2 rounded-full ${keyword && description.toLowerCase().includes(keyword.toLowerCase()) ? "bg-success" : "bg-slate-300"}`} />
                                                Desc. Keyword
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </PremiumLock>
                        <ToolBenefits toolSlug="serp-previewer" />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Preview</h2>
                        </div>

                        {/* Google Desktop */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 border-b">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500">
                                    <Monitor className="w-4 h-4" /> Google Desktop
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="max-w-[600px]">
                                    <div className="flex items-center gap-1 mb-1 group cursor-pointer">
                                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-500 border border-slate-200">
                                            {url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname[0].toUpperCase() : 'G'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-[#202124] leading-none">
                                                {url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : 'example.com'}
                                            </span>
                                            <span className="text-xs text-[#5f6368] leading-none mt-0.5">
                                                {url || 'https://example.com/page'}
                                            </span>
                                        </div>
                                    </div>
                                    <a href="#" className="text-xl text-[#1a0dab] hover:underline truncate block" onClick={e => e.preventDefault()}>
                                        {title || 'Your Page Title | Brand'}
                                    </a>
                                    <div className="text-sm text-[#4d5156] leading-snug break-words mt-1">
                                        {description || 'This is how your meta description will look in Google search results. Keep it between 120 and 160 characters for optimal visibility.'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Google Mobile */}
                        <Card>
                            <CardHeader className="py-3 bg-slate-50 border-b">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500">
                                    <Smartphone className="w-4 h-4" /> Google Mobile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="max-w-[375px] mx-auto sm:mx-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex-shrink-0 border flex items-center justify-center text-xs">
                                            {url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname[0].toUpperCase() : 'G'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#202124]">
                                                {url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : 'example.com'}
                                            </span>
                                            <span className="text-xs text-[#5f6368]">
                                                {url ? new URL(url.startsWith('http') ? url : `https://${url}`).hostname : 'example.com'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-[#1a0dab] text-lg leading-6 font-normal truncate">
                                        {title || 'Your Page Title'}
                                    </div>
                                    <div className="text-sm text-[#4d5156] mt-1 leading-5">
                                        {description || 'Mobile descriptions are often shorter. Make sure your key point is early in the text.'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
