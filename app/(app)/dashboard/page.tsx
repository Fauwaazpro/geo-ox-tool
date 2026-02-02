"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TOOLS, CATEGORIES } from "@/lib/constants"
import {
    Shield, Code2, Gauge, Smartphone, Link as LinkIcon,
    Sparkles, BarChart3, FileText, MessageSquare, Network,
    Quote, GitBranch, Search, Eye, Copy, Key, Cpu, Lock, ArrowRight
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<any>> = {
    Shield, Code2, Gauge, Smartphone, LinkIcon,
    Sparkles, BarChart3, FileText, MessageSquare, Network,
    Quote, GitBranch, Search, Eye, Copy, Key, Cpu,
    Link: LinkIcon
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            {/* Header Removed (Using Global DashboardNav) */}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                {/* Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">
                        Welcome to <span className="text-gradient">GEO Ox Dashboard</span>
                    </h1>
                    <p className="text-xl text-slate-500">
                        Select a tool to start optimizing for the age of AI
                    </p>
                </div>

                {/* Tools Grid - Synced with Home Page Style */}
                <div className="space-y-16">
                    {Object.entries(CATEGORIES).map(([categoryKey, category]) => {
                        const categoryTools = TOOLS.filter(tool => tool.category === categoryKey)

                        return (
                            <div key={categoryKey}>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className={`h-8 w-1 bg-gradient-to-b ${category.color} rounded-full`} />
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
                                        <p className="text-sm text-slate-500">{category.description}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categoryTools.map(tool => {
                                        const Icon = iconMap[tool.icon]
                                        return (
                                            <Link href={`/dashboard/${tool.slug}`} key={tool.id}>
                                                <Card className="h-full hover:border-yellow-400 hover:shadow-glow-yellow transition-all duration-300 group cursor-pointer border-slate-200 relative overflow-hidden">
                                                    {/* Yellow Gradient Overlay on Hover */}
                                                    <div className="absolute inset-0 bg-yellow-50/0 group-hover:bg-yellow-50/10 transition-colors pointer-events-none" />

                                                    <CardHeader>
                                                        <div className="flex justify-between items-start">
                                                            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors shadow-sm">
                                                                <Icon className="w-6 h-6" />
                                                            </div>
                                                            {tool.isPremium && (
                                                                <Badge className="bg-gradient-primary text-white border-0">PRO</Badge>
                                                            )}
                                                        </div>
                                                        <CardTitle className="mt-4 text-slate-800 group-hover:text-blue-700 transition-colors">{tool.name}</CardTitle>
                                                        <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                                                            Launch Tool <ArrowRight className="ml-1 w-4 h-4" />
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
            </main>
        </div>
    )
}
