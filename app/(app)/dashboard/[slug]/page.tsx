"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TOOLS, type Tool } from "@/lib/constants"
import { ArrowLeft, Wrench } from "lucide-react"

export default function ToolPage({ params }: { params: { slug: string } }) {
    const tool = TOOLS.find(t => t.slug === params.slug) as Tool | undefined

    if (!tool) {
        notFound()
    }

    // List of implemented tools
    const implementedTools = ['technical-readiness', 'schema-generator']
    const isImplemented = implementedTools.includes(params.slug)

    // If tool is implemented, redirect will be handled by the specific page
    // This is a fallback for non-implemented tools
    if (isImplemented) {
        return null // The specific tool page will render instead
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
                        <span className="font-semibold">{tool.name}</span>
                    </div>

                    <div className="w-32" />
                </div>
            </header>

            {/* Coming Soon Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-2 border-dashed">
                        <CardHeader className="text-center pb-8 pt-12">
                            <div className="mx-auto w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6">
                                <Wrench className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-3xl mb-4">{tool.name}</CardTitle>
                            <CardDescription className="text-lg">
                                {tool.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center pb-12">
                            <div className="space-y-6">
                                <div className="p-6 bg-surface rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">🚧 Under Development</h3>
                                    <p className="text-muted-foreground">
                                        This tool is currently being built and will be available soon.
                                    </p>
                                </div>

                                {tool.isPremium && (
                                    <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                                        <span className="inline-block px-3 py-1 bg-gradient-primary text-white text-sm font-medium rounded-full mb-2">
                                            Premium Tool
                                        </span>
                                        <p className="text-sm text-muted-foreground">
                                            Available with Pro and Enterprise plans
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        In the meantime, try our working tools:
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <Link href="/dashboard/technical-readiness">
                                            <Button variant="outline">Technical Readiness Checker</Button>
                                        </Link>
                                        <Link href="/dashboard/schema-generator">
                                            <Button variant="outline">Schema Generator</Button>
                                        </Link>
                                    </div>
                                </div>

                                <Link href="/dashboard">
                                    <Button className="mt-4" size="lg">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to All Tools
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expected Features Preview */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">What to Expect</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>Real-time analysis and actionable insights</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>Split-screen interface with instant solutions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>One-click code generation and export</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">✓</span>
                                    <span>Professional-grade accuracy and performance</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
