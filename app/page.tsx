"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ParticleBackground } from "@/components/particle-background"
import { GuideDownloadButton } from "@/components/guide-download-button"
import { TOOLS, CATEGORIES } from "@/lib/constants"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Play } from "lucide-react"
import { Shield, Code2, Gauge, Smartphone, Link as LinkIcon, Sparkles, BarChart3, FileText, MessageSquare, Network, Quote, GitBranch, Search, Eye, Copy, Key, Cpu, Lock, ArrowRight, Zap, CheckCircle2, Globe, Users, ChevronDown } from "lucide-react"

// Icon Mapping
const iconMap: Record<string, React.ComponentType<any>> = {
    Shield, Code2, Gauge, Smartphone, LinkIcon,
    Sparkles, BarChart3, FileText, MessageSquare, Network,
    Quote, GitBranch, Search, Eye, Copy, Key, Cpu,
    Link: LinkIcon
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Card className={`border-slate-200 shadow-sm transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-100' : 'hover:shadow-md'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left"
            >
                <span className="text-lg font-bold text-slate-800 pr-4">{question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 md:px-6 md:pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                        {answer}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default function LandingPage() {
    const supabase = createClient()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setIsLoggedIn(!!user)
        }
        checkUser()
    }, [])

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is GEO (Generative Engine Optimization)?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Generative Engine Optimization is the process of optimizing website content so that AI models like Gemini, ChatGPT, and Perplexity can easily find, understand, and cite your site as a primary source. Unlike traditional SEO, which focuses on ranking in a list of links, GEO focuses on becoming the \"Answer\" provided by the AI."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does the llms.txt Generator benefit my site?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The /llms.txt file acts as a high-speed lane for AI crawlers. By providing a clean, Markdown-formatted summary of your site's structure and core content, you reduce \"token noise.\" This makes it significantly more likely that an LLM will accurately represent your business without hallucinating or skipping key details."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Why is \"Answer-First\" structure important for AI?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "AI models typically process information in \"chunks.\" If your most valuable information is hidden deep within a paragraph, the AI may lose context. Our Answer-First tool helps you restructure pages so that the most relevant information is presented immediately in a declarative format, which is the preferred \"diet\" for Large Language Models."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Does GEO replace traditional SEO?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No, GEO complements it. While traditional SEO drives traffic from search engine results pages (SERPs), GEO ensures your brand is visible in conversational search and AI-driven summaries. Our platform integrates both technical SEO readiness and AI-specific semantic mapping."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do I track if my site is being used by AI?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Our Citation Radar and GEO Gap Analysis tools monitor how AI models describe your industry. We track brand mentions and \"citation rates\" within AI responses, giving you a clear picture of your digital footprint in the generative era."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does the subscription work?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Our subscription is designed to be the most affordable and comprehensive AI optimization suite on the market. For just $19.99/month, you get full, unlimited access to all 18 specialized GEO and SEO tools. We believe you shouldn't have to spend 100s of dollars on bloated platforms to get professional results."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is this a good alternative to Ahrefs or Semrush?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes. While those tools are built for the era of \"Blue Links,\" our platform is built for the AI-First world. We provide the best alternative for users who want to move beyond traditional keyword tracking and optimize for Generative Engines (GEO). We consolidate everything from technical readiness to semantic mapping into one affordable $19.99 package, saving you over $100/month compared to major legacy tools."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I cancel my subscription at any time?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, you can cancel at any time. There are no long-term contracts or hidden \"breakup\" fees. If you decide to cancel, you will maintain access to all 18 tools until the end of your current billing cycle. You can manage your cancellation directly from your Account Dashboard with a single click."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Do I need technical coding skills to use these tools?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "No technical skills are required. While our tools handle complex tasks like JSON-LD Schema generation and llms.txt creation, the interface is strictly \"point-and-click.\" We handle the heavy machine learning logic in the background so you can focus on growing your visibility."
                                }
                            }
                        ]
                    })
                }}
            />

            {/* Header / Nav */}
            <header className="fixed top-0 w-full z-50 glass border-b border-slate-200/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/images/geo-ox-logo.png"
                                alt="GEO Ox Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-widest text-slate-800 group-hover:text-blue-600 transition-colors font-orbitron">
                            GEO Ox
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Platform</a>
                        <a href="#tools" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Tools</a>
                        <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
                        <GuideDownloadButton variant="default" size="sm" className="ml-2 bg-yellow-400 hover:bg-orange-500 text-blue-700 hover:text-white font-bold border-none shadow-[0_0_15px_rgba(250,204,21,0.6)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] transition-all duration-300 transform hover:scale-105" showIcon={true} />
                    </nav>

                    <div className="flex items-center space-x-4">
                        {/* Log In Link Removed */}
                        {!isLoggedIn && (
                            <Link href="/login">
                                <Button className="font-semibold shadow-lg shadow-blue-500/20">
                                    Get Started Free
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <ParticleBackground />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-blue-200 bg-blue-50 text-blue-700 rounded-full animate-float">
                        ✨ new: AI-First Optimization Engine
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight max-w-5xl mx-auto">
                        The Perfect Place to Optimize Your Website for <span className="text-gradient">AI & GEO</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Best-in-class tools to make your website AI-friendly, search-ready, and optimized for the future of machines.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {!isLoggedIn && (
                            <Link href="/login">
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform">
                                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                        <div className="relative group inline-block">
                            {/* Particles - Floating Upon Button */}
                            <div className="absolute -top-1 left-8 w-2 h-2 bg-yellow-400 rounded-full blur-[1px] opacity-90 animate-particle-float z-20 pointer-events-none" style={{ animationDelay: '0s' }} />
                            <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-orange-400 rounded-full blur-[0.5px] opacity-100 animate-particle-float z-20 pointer-events-none" style={{ animationDelay: '1s', animationDuration: '4s' }} />
                            <div className="absolute -bottom-1 right-12 w-2 h-2 bg-yellow-300 rounded-full blur-[1px] opacity-90 animate-particle-float z-20 pointer-events-none" style={{ animationDelay: '2s' }} />
                            <div className="absolute top-1/2 -left-1 w-1.5 h-1.5 bg-orange-500 rounded-full blur-[0.5px] opacity-100 animate-particle-float z-20 pointer-events-none" style={{ animationDelay: '3s', animationDuration: '5s' }} />
                            <div className="absolute top-2 right-6 w-1 h-1 bg-white rounded-full blur-[0px] opacity-100 animate-pulse z-20 pointer-events-none" />

                            <Link href="#tools">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/50 backdrop-blur border-yellow-200 hover:bg-white hover:text-orange-600 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] relative z-10 text-slate-700 hover:border-orange-300">
                                    Explore Tools
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard Preview / Trusted By */}
                    <div className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-slate-200 shadow-2xl bg-white/50 backdrop-blur p-2 hidden md:block">
                        <div className="aspect-[16/9] rounded-lg bg-slate-50 overflow-hidden relative group border border-slate-100">

                            {/* Browser Top Bar */}
                            <div className="h-8 bg-white border-b border-slate-100 flex items-center px-4 space-x-2">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                                </div>
                                <div className="flex-1 max-w-sm mx-auto h-5 bg-slate-50 rounded text-[10px] text-slate-400 flex items-center justify-center font-mono">
                                    geo-ox.ai/dashboard/live-audit
                                </div>
                            </div>

                            {/* Dashboard Layout */}
                            <div className="flex h-full pb-8">
                                {/* Sidebar */}
                                <div className="w-48 bg-white border-r border-slate-100 p-4 space-y-4 hidden lg:block">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <div className="relative w-6 h-6">
                                            <Image src="/images/geo-ox-logo.png" alt="Logo" fill className="object-contain" />
                                        </div>
                                        <span className="font-bold text-sm tracking-widest text-slate-700 font-orbitron">GEO Ox</span>
                                    </div>
                                    <div className="space-y-2 pt-4">
                                        <div className="h-8 w-full bg-blue-50/50 rounded-md border border-blue-100" />
                                        <div className="h-8 w-full bg-slate-50 rounded-md" />
                                        <div className="h-8 w-full bg-slate-50 rounded-md" />
                                    </div>
                                    <div className="space-y-2 pt-8">
                                        <div className="h-8 w-full bg-slate-50 rounded-md" />
                                        <div className="h-8 w-full bg-slate-50 rounded-md" />
                                    </div>
                                </div>

                                {/* Main Area with AI Animations */}
                                <div className="flex-1 p-6 space-y-6 overflow-hidden relative bg-slate-950/80 backdrop-blur-sm">
                                    {/* Background: Digital Data Matrix Grid */}
                                    <div className="absolute inset-0 z-0 opacity-20"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                                            backgroundSize: '20px 20px'
                                        }}
                                    />
                                    <div className="absolute inset-0 z-0 animate-data-stream opacity-30 pointer-events-none mix-blend-screen" />

                                    {/* Header & Score */}
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-2">
                                            <div className="h-6 w-48 bg-slate-800/80 rounded animate-pulse" />
                                            <div className="h-4 w-64 bg-slate-800/50 rounded animate-pulse" />
                                        </div>
                                        <div className="flex items-center space-x-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                                            <span className="font-mono tracking-wider">AI AGENT: ACTIVE</span>
                                        </div>
                                    </div>

                                    {/* Simulated Charts/Grid */}
                                    <div className="grid grid-cols-12 gap-4 relative z-10">
                                        {/* AI Optimization Core (Radar) */}
                                        <div className="col-span-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden group">
                                            {/* Rotating Radar Overlay */}
                                            <div className="absolute inset-[-50%] animate-radar-sweep pointer-events-none opacity-20" />

                                            <div className="text-[10px] text-slate-400 mb-2 font-mono uppercase tracking-widest relative z-10 text-center">Neural Confidence</div>
                                            <div className="flex items-center justify-center h-24 relative z-10">
                                                <div className="absolute inset-0 flex items-center justify-center font-orbitron font-bold text-3xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                                    98<span className="text-sm text-slate-500 ml-0.5">%</span>
                                                </div>
                                                <svg className="w-24 h-24 rotate-[-90deg]">
                                                    <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="6" fill="none" />
                                                    <circle cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="6" fill="none" strokeDasharray="251" strokeDashoffset="10" className="transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Live Neural Log */}
                                        <div className="col-span-8 bg-black/40 backdrop-blur-md rounded-xl p-4 font-mono text-xs text-green-400 space-y-3 overflow-hidden relative shadow-inner border border-green-500/20">
                                            <div className="absolute inset-0 bg-green-900/5 pointer-events-none" />
                                            <div className="absolute top-0 right-0 p-2 opacity-70">
                                                <Badge variant="outline" className="text-[9px] border-green-500/30 text-green-500 bg-green-500/10 tracking-widest">NEURAL NET V2.0</Badge>
                                            </div>
                                            <div className="opacity-50 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> <span className="text-slate-400">Initializing Nodes...</span></div>
                                            <div className="opacity-80 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Mapping Semantic Entitites...</div>
                                            <div className="opacity-100 flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.2)]"><div className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> <span className="text-green-300 font-bold">Optimizing Token Context Window...</span></div>
                                            <div className="inline-block text-blue-300 font-bold border-r-2 border-blue-500 animate-typewriter overflow-hidden whitespace-nowrap align-bottom max-w-full drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">
                                                _ Generating Knowledge Graph...
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Grid with Dynamic Bars */}
                                    <div className="grid grid-cols-4 gap-4 h-32 relative z-10">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3 relative overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-500 group">
                                                <div className="h-1.5 w-12 bg-slate-700/50 rounded" />

                                                {/* Vertical Data Stream Bar */}
                                                <div className="h-full w-1.5 bg-slate-800 rounded-full absolute right-4 top-3 overflow-hidden">
                                                    <div className="w-full bg-blue-500 animate-data-stream shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ height: '50%', animationDuration: `${i + 1.5}s` }} />
                                                </div>

                                                <div className="h-6 w-8 bg-slate-800 rounded animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                                                    <div className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" style={{ width: `${Math.random() * 60 + 20}%`, transition: 'width 0.5s ease-in-out' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Success Toast (Simulated Notification) */}
                            <div className="absolute bottom-8 right-8 bg-white border border-green-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 rounded-xl flex items-center space-x-3 animate-float max-w-xs z-20" style={{ animationDelay: '1s' }}>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm shrink-0">
                                    <Zap className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">Opportunity Found</div>
                                    <div className="text-sm font-bold text-slate-800 leading-tight">Reduce LCP by 1.2s to boost Mobile Rank</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATISTICS (Social Proof) */}
            <section className="py-12 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Active Users", value: "50,000+", icon: Users },
                            { label: "URLs Analyzed Daily", value: "20K+", icon: Globe },
                            { label: "Average Rating", value: "4.9/5", icon: Sparkles },
                            { label: "Countries", value: "70+", icon: Network }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUE PROP: GEO vs SEO */}
            <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge variant="secondary" className="mb-4">Why GEO?</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            The Evolution from Search to <span className="text-blue-600">Answer Engines</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Traditional SEO captures clicks. GEO (General Machine Optimization) captures answers.
                            AI assistants like ChatGPT and Claude read your site differently than Google bot.
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white group">
                                    <Play className="w-5 h-5 mr-2 fill-current" />
                                    Watch Explainer Video
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none shadow-none">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-slate-700">
                                    <iframe
                                        src="https://player.vimeo.com/video/1160166073?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                        allowFullScreen
                                        className="absolute top-0 left-0 w-full h-full"
                                        title="GEO OX video"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <Zap className="w-10 h-10 text-yellow-500 mb-2" />
                                <CardTitle>Deep Analysis</CardTitle>
                                <CardDescription>We don&apos;t guess. We analyze deep.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-slate-600">
                                Crawl deeper than standard bots to understand how LLMs parse your content structure and entity relationships.
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <Cpu className="w-10 h-10 text-purple-500 mb-2" />
                                <CardTitle>AI-First Metrics</CardTitle>
                                <CardDescription>Optimized for Machine Reading</CardDescription>
                            </CardHeader>
                            <CardContent className="text-slate-600">
                                Measure &quot;Citability&quot; and &quot;Token Density&quot; instead of just keywords. Make your content easy for AI to reference.
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <Shield className="w-10 h-10 text-green-500 mb-2" />
                                <CardTitle>Future Proof</CardTitle>
                                <CardDescription>Ready for Search Generative Experience</CardDescription>
                            </CardHeader>
                            <CardContent className="text-slate-600">
                                As Google moves to SGE, your site needs to be authoritative enough to be the source of truth.
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* TOOLS SHOWCASE */}
            <section id="tools" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            18 Specialized <span className="text-gradient">Micro-Tools</span>
                        </h2>
                        <p className="text-lg text-slate-600">
                            Everything you need to audit, optimize, and perfect your digital presence.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {Object.entries(CATEGORIES).map(([catKey, category]) => {
                            const catTools = TOOLS.filter(t => t.category === catKey)
                            return (
                                <div key={catKey}>
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className={`h-8 w-1 bg-gradient-to-b ${category.color} rounded-full`} />
                                        <h3 className="text-2xl font-bold text-slate-900">{category.name}</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {catTools.map(tool => {
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
                                                                Try Tool <ArrowRight className="ml-1 w-4 h-4" />
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
                </div>
            </section>

            {/* SEO & AI PROMO SECTION */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Future-Proof Your Rankings</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                                Dominate <span className="text-gradient">AI Search Results</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Search engines are evolving into Answer Engines. GEO Ox gives you the specialized tools to ensure your content is understood, cited, and prioritized by AI models like GPT-4, Gemini, and Claude.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    "Optimize for Zero-Click Searches",
                                    "Enhance Entity Recognition",
                                    "Boost Token Relevance Score"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-slate-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login">
                                <Button size="lg" className="mt-6 rounded-full px-8 shadow-lg shadow-blue-500/20">
                                    Start Optimizing Now
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-1 relative">
                            {/* Code Snippet Visual */}
                            <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-slate-800 transform hover:scale-105 transition-transform duration-500">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono ml-auto">ai-manifest.json</div>
                                </div>
                                <pre className="font-mono text-xs md:text-sm text-green-400 overflow-x-auto">
                                    <code>{`{
  "entity": "Your_Brand",
  "type": "Authority",
  "optimization_score": 98,
  "ai_readability": "High",
  "structured_data": true,
  "vector_embeddings": "Optimized"
}`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MUST YOU KNOW - FAQ SECTION */}
            <section id="faq" className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge variant="outline" className="mb-4 border-purple-200 bg-purple-50 text-purple-700">Knowledge Base</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Must You Know: <span className="text-gradient">GEO Fundamentals</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Understanding the shift from Search Engines to Answer Engines.
                        </p>
                        <div className="flex justify-center">
                            <GuideDownloadButton variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="bg-slate-50 border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-900 mb-2">What is GEO (Generative Engine Optimization)?</CardTitle>
                                        <CardDescription className="text-slate-600 text-base leading-relaxed">
                                            Generative Engine Optimization is the process of optimizing website content so that AI models like Gemini, ChatGPT, and Perplexity can easily find, understand, and cite your site as a primary source. Unlike traditional SEO, which focuses on ranking in a list of links, GEO focuses on becoming the &quot;Answer&quot; provided by the AI.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-900 mb-2">How does the llms.txt Generator benefit my site?</CardTitle>
                                        <CardDescription className="text-slate-600 text-base leading-relaxed">
                                            The /llms.txt file acts as a high-speed lane for AI crawlers. By providing a clean, Markdown-formatted summary of your site&apos;s structure and core content, you reduce &quot;token noise.&quot; This makes it significantly more likely that an LLM will accurately represent your business without hallucinating or skipping key details.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-900 mb-2">Why is &quot;Answer-First&quot; structure important for AI?</CardTitle>
                                        <CardDescription className="text-slate-600 text-base leading-relaxed">
                                            AI models typically process information in &quot;chunks.&quot; If your most valuable information is hidden deep within a paragraph, the AI may lose context. Our Answer-First tool helps you restructure pages so that the most relevant information is presented immediately in a declarative format, which is the preferred &quot;diet&quot; for Large Language Models.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="bg-slate-50 border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-green-100 rounded-lg text-green-600 shrink-0">
                                        <Network className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-slate-900 mb-2">Does GEO replace traditional SEO?</CardTitle>
                                        <CardDescription className="text-slate-600 text-base leading-relaxed">
                                            No, GEO complements it. While traditional SEO drives traffic from search engine results pages (SERPs), GEO ensures your brand is visible in conversational search and AI-driven summaries. Our platform integrates both technical SEO readiness and AI-specific semantic mapping.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="md:col-span-2 bg-slate-900 border-slate-800 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors" />
                            <CardHeader className="relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-slate-800 rounded-lg text-blue-400 shrink-0">
                                        <Gauge className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-white mb-2">How do I track if my site is being used by AI?</CardTitle>
                                        <CardDescription className="text-slate-300 text-base leading-relaxed">
                                            Our Citation Radar and GEO Gap Analysis tools monitor how AI models describe your industry. We track brand mentions and &quot;citation rates&quot; within AI responses, giving you a clear picture of your digital footprint in the generative era.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* GENERAL FAQ SECTION */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge variant="outline" className="mb-4 border-slate-300 bg-white text-slate-700">FAQ</Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                            Frequently Asked <span className="text-blue-600">Questions</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                q: "How does the subscription work?",
                                a: "Our subscription is designed to be the most affordable and comprehensive AI optimization suite on the market. For just $19.99/month, you get full, unlimited access to all 18 specialized GEO and SEO tools. We believe you shouldn't have to spend 100s of dollars on bloated platforms to get professional results."
                            },
                            {
                                q: "Is this a good alternative to Ahrefs or Semrush?",
                                a: "Yes. While those tools are built for the era of \"Blue Links,\" our platform is built for the AI-First world. We provide the best alternative for users who want to move beyond traditional keyword tracking and optimize for Generative Engines (GEO). We consolidate everything from technical readiness to semantic mapping into one affordable $19.99 package, saving you over $100/month compared to major legacy tools."
                            },
                            {
                                q: "Can I cancel my subscription at any time?",
                                a: "Yes, you can cancel at any time. There are no long-term contracts or hidden \"breakup\" fees. If you decide to cancel, you will maintain access to all 18 tools until the end of your current billing cycle. You can manage your cancellation directly from your Account Dashboard with a single click."
                            },
                            {
                                q: "Do I need technical coding skills to use these tools?",
                                a: "No technical skills are required. While our tools handle complex tasks like JSON-LD Schema generation and llms.txt creation, the interface is strictly \"point-and-click.\" We handle the heavy machine learning logic in the background so you can focus on growing your visibility."
                            }
                        ].map((item, i) => (
                            <FAQItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>

                </div>
            </section>

            {/* Footer is now Global in Layout */}
        </div>
    )
}
