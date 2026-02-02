"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare, CreditCard, ArrowRight, HelpCircle } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
            {/* Header / Nav - Simplified for sub-pages (Matched with About Page) */}
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
                        <Badge variant="outline" className="mb-4 border-purple-200 bg-purple-50 text-purple-700">Contact Support</Badge>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-display">
                            Get in Touch with the <span className="text-gradient">GEOOX Team</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Have a question about GEO? We have the answers.
                        </p>
                    </div>

                    {/* How Can We Help Section */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How Can We Help You?</h2>

                        <div className="grid gap-6">
                            {/* Technical Support */}
                            <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 md:flex md:items-center">
                                <div className="p-6 md:w-1/4 flex justify-center md:justify-start md:border-r border-slate-100">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                        <MessageSquare className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="p-6 md:w-3/4">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Technical Support</h3>
                                    <p className="text-slate-600 mb-4">
                                        Use Our Chat Bot for instant answers or go through our comprehensive FAQ Section to find what you need.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <Link href="/#faq">
                                            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                                Visit FAQ <HelpCircle className="ml-2 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>

                            {/* Billing & Subscriptions */}
                            <Card className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 md:flex md:items-center">
                                <div className="p-6 md:w-1/4 flex justify-center md:justify-start md:border-r border-slate-100">
                                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                                        <CreditCard className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="p-6 md:w-3/4">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Billing & Subscriptions</h3>
                                    <p className="text-slate-600 mb-4">
                                        Need help with an invoice or want to change your plan? Visit your Account Dashboard for instant management.
                                    </p>
                                    <Link href="/dashboard/account">
                                        <Button className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20">
                                            Manage Subscription <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
