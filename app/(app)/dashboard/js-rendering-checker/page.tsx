"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, ArrowLeft, Check, X } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"
import { PremiumLock } from "@/components/premium-lock"
import { ToolBenefits } from "@/components/tool-benefits"

interface RenderingCheck {
    content: string
    visibleWithJS: boolean
    visibleWithoutJS: boolean
    critical: boolean
}

export default function JSRenderingPage() {
    const { isPremium } = usePremium()
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<RenderingCheck[] | null>(null)

    const handleAnalyze = async () => {
        if (!url) return

        setLoading(true)
        setResults(null)

        try {
            const response = await fetch('/api/js-rendering', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (!response.ok) {
                throw new Error('Analysis failed')
            }

            const data = await response.json()
            setResults(data.results)
        } catch (error) {
            console.error('Analysis failed:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const criticalMissing = results?.filter(r => r.critical && !r.visibleWithoutJS).length || 0

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
                        <Cpu className="w-5 h-5 text-primary" />
                        <span className="font-semibold">JavaScript Rendering Checker</span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left - Analysis */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">JS Rendering Test</h1>
                            <p className="text-muted-foreground">
                                Verify content is visible without JavaScript
                            </p>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Test Rendering</CardTitle>
                                <CardDescription>Check if Googlebot can see your content</CardDescription>
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
                            </CardContent>
                        </Card>

                        {results && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Content Visibility</span>
                                        {criticalMissing > 0 && (
                                            <span className="text-lg font-bold text-destructive">
                                                {criticalMissing} Critical Issues
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Comparing JS-enabled vs disabled rendering
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {displayedResults?.map((check, index) => (
                                        <div key={index} className={`p-4 rounded-lg border ${!check.visibleWithoutJS && check.critical
                                            ? 'border-destructive/30 bg-destructive/5'
                                            : !check.visibleWithoutJS
                                                ? 'border-yellow-600/30 bg-yellow-600/5'
                                                : 'border-success/30 bg-success/5'
                                            }`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {check.visibleWithoutJS ? (
                                                        <Check className="w-5 h-5 text-success" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-destructive" />
                                                    )}
                                                    <span className="font-medium">{check.content}</span>
                                                </div>
                                                {check.critical && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                                                        Critical
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground">With JS:</span>
                                                    <Check className="w-4 h-4 text-success" />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-muted-foreground">Without JS:</span>
                                                    {check.visibleWithoutJS ? (
                                                        <Check className="w-4 h-4 text-success" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-destructive" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {!isPremium && lockedCount > 0 && (
                                        <PremiumLock isLocked={true} title={`Unlock ${lockedCount} More Checks`}>
                                            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 h-24"></div>
                                        </PremiumLock>
                                    )}
                                </CardContent>
                            </Card>

                        )}
                        <ToolBenefits toolSlug="js-rendering-checker" />
                    </div>

                    {/* Right - Solutions */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">SEO Recommendations</h2>
                            <p className="text-muted-foreground">Ensure search engines can crawl your content</p>
                        </div>

                        {results ? (
                            <PremiumLock isLocked={!isPremium} title="Unlock SEO Recommendations">
                                {criticalMissing > 0 ? (
                                    <>
                                        <Card className="border-destructive/50">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-destructive">⚠️ SEO Risk Detected</CardTitle>
                                                <CardDescription>
                                                    {criticalMissing} critical content elements are not visible without JavaScript
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Search engine bots may not see this content, hurting your rankings.
                                                </p>
                                                <div className="space-y-2">
                                                    {results.filter(r => r.critical && !r.visibleWithoutJS).map((item, idx) => (
                                                        <div key={idx} className="p-2 bg-background rounded text-sm">
                                                            ❌ {item.content}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Server-Side Rendering (SSR)</CardTitle>
                                                <CardDescription>Recommended solution</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm mb-3">
                                                    Use Next.js, Nuxt, or similar framework to render content on the server:
                                                </p>
                                                <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
                                                    {`// Next.js example
export async function getServerSideProps() {
  const products = await fetchProducts()
  return { props: { products } }
}

export default function Page({ products }) {
  return <ProductList items={products} />
}`}
                                                </pre>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Static HTML Fallback</CardTitle>
                                                <CardDescription>Alternative approach</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm mb-3">
                                                    Provide static HTML content with progressive enhancement:
                                                </p>
                                                <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
                                                    {`<div class="product-list">
  <!-- Static HTML loaded first -->
  <div class="product">Product 1</div>
  <div class="product">Product 2</div>
</div>
<script>
  // Enhanced with JS after page load
  enhanceProductList()
</script>`}
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </>
                                ) : (
                                    <Card className="border-success/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg text-success">✓ SEO-Friendly Rendering</CardTitle>
                                            <CardDescription>
                                                All critical content is visible without JavaScript
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                ✅ Search engines can fully crawl your site<br />
                                                ✅ Content is accessible to all users<br />
                                                ✅ Better performance and SEO rankings
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </PremiumLock>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
                                    <div className="text-center">
                                        <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Test a URL to check JS rendering</p>
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
