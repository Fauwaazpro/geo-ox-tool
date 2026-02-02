"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
            {/* Header / Nav - Simplified for sub-pages */}
            <header className="fixed top-0 w-full z-50 glass border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
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
                        <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Platform</Link>
                        <Link href="/#tools" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Tools</Link>
                        <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <Button className="font-semibold shadow-lg shadow-blue-500/20">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4 border-blue-200 bg-blue-50 text-blue-700">About Us</Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-display">
                            About GEOOX: <span className="text-gradient">The Future of Visibility</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            The internet is entering its most significant transformation since the invention of the search engine.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                                At GEOOX, we believe that as the world moves from scrolling through pages of links to getting instant answers from AI, the old rules of SEO are breaking.
                            </p>
                            <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                Our mission is simple: To democratize <strong>Generative Engine Optimization (GEO)</strong>. We provide every website owner—from small bloggers to scaling SaaS companies—the tools they need to be found, understood, and cited by the AI models that now power the web.
                            </p>
                        </div>
                    </section>

                    {/* Why Uses Exists */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Why GEOOX Exists</h2>
                        <div className="prose prose-slate max-w-none text-lg text-slate-600 leading-relaxed">
                            <p className="mb-4">
                                For decades, a few massive corporations controlled search visibility, charging hundreds of dollars a month for complex tools. When Generative AI (like Gemini, ChatGPT, and Perplexity) arrived, a "Visibility Gap" was created. Small and medium businesses were left behind, unsure how to make their sites readable for these new machine-learning models.
                            </p>
                            <p>
                                We built GEOOX to close that gap. By offering a suite of 18 pro-grade AI optimization tools for just <strong>$19.99</strong>, we are stripping away the complexity and the high cost of the "Old SEO" giants.
                            </p>
                        </div>
                    </section>

                    {/* What Sets Us Apart */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">What Sets Us Apart</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">Beyond Keywords</h3>
                                    <p className="text-slate-600">
                                        We Understand Entities, Not Just Keywords. We focus on how AI connects concepts, ensuring your brand is seen as an authority.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">Citability First</h3>
                                    <p className="text-slate-600">
                                        Our tools don't just help you rank; they help you become the "source of truth" that AI models quote in their responses.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">Efficiency</h3>
                                    <p className="text-slate-600">
                                        We value your time. Our tools, like the Automated llms.txt Generator, are designed to work with one click.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Philosophy */}
                    <section className="mb-16 bg-slate-900 text-slate-300 p-8 md:p-12 rounded-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-6">Our Philosophy: The "Source of Truth" Standard</h2>
                            <p className="text-lg leading-relaxed mb-6">
                                In a world of AI "hallucinations," accuracy is the ultimate currency. We believe that by helping websites structure their data correctly, we are helping the entire AI ecosystem become more reliable.
                            </p>
                            <p className="text-lg leading-relaxed text-white font-medium">
                                When your site is "GEO-Optimized" by GEOOX, you aren't just winning traffic—you are helping build a smarter, more factual internet.
                            </p>
                        </div>
                    </section>

                    {/* Join the Revolution */}
                    <section className="text-center py-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Join the Revolution</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                            The era of the "Blue Link" is fading. The era of the Cited Answer is here. Whether you are a solo creator or a digital agency, GEOOX is your partner in navigating the next decade of the internet.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Stop searching for the future. Start being the answer.
                            </p>
                            <Link href="/login" className="mt-4">
                                <Button size="lg" className="rounded-full px-8 h-12 text-lg shadow-xl shadow-blue-500/20">
                                    Start Optimizing Now <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
