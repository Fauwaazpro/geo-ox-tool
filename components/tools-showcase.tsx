"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { TOOLS, CATEGORIES } from "@/lib/constants"
import {
    Shield, Code2, Gauge, Smartphone, Link as LinkIcon,
    Sparkles, BarChart3, FileText, MessageSquare, Network,
    Quote, GitBranch, Search, Eye, Copy, Key, Cpu
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<any>> = {
    Shield, Code2, Gauge, Smartphone, LinkIcon,
    Sparkles, BarChart3, FileText, MessageSquare, Network,
    Quote, GitBranch, Search, Eye, Copy, Key, Cpu,
    Link: LinkIcon // Alias for compatibility
}

export function ToolsShowcase() {
    return (
        <section id="tools" className="py-24 bg-surface">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        18 Tools. <span className="text-gradient">Unlimited Precision.</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Every tool engineered for accuracy, speed, and actionable insights.
                    </p>
                </div>

                {Object.entries(CATEGORIES).map(([categoryKey, category]) => {
                    const categoryTools = TOOLS.filter(tool => tool.category === categoryKey)

                    return (
                        <div key={categoryKey} className="mb-16">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                <p className="text-muted-foreground">{category.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryTools.map((tool) => {
                                    const Icon = iconMap[tool.icon]
                                    return (
                                        <Link
                                            key={tool.id}
                                            href={`/dashboard/${tool.slug}`}
                                            className="block"
                                        >
                                            <Card
                                                className="group cursor-pointer hover:shadow-premium transition-all duration-300 hover:-translate-y-1 h-full"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-10`}>
                                                            <Icon className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                                                {tool.name}
                                                                {tool.isPremium && (
                                                                    <span className="ml-2 text-xs bg-gradient-primary text-white px-2 py-1 rounded-full">
                                                                        Premium
                                                                    </span>
                                                                )}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {tool.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
