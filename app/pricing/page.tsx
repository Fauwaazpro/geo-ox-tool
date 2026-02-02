"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft, Zap } from "lucide-react"

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="font-bold text-xl tracking-tight">GEO Ox</div>
                    <div className="w-32" />
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">

                    {/* Free Plan */}
                    <Card className="border-slate-200 shadow-sm relative overflow-hidden order-2 md:order-1 opacity-80 hover:opacity-100 transition-opacity">
                        <CardHeader>
                            <CardTitle className="text-xl">Starter</CardTitle>
                            <CardDescription>For casual explorers</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>Basic Tool Access</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>Limited Audit Reports</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span>3 Daily Searches</span>
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <Check className="w-4 h-4 opacity-50" />
                                    <span>Advanced Metrics (Locked)</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/dashboard">Continue Free</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-primary shadow-xl relative overflow-hidden order-1 md:order-2 scale-105">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl">
                            POPULAR
                        </div>
                        <CardHeader>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                <Zap className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-2xl">GEO Ox Pro</CardTitle>
                            <CardDescription>Everything you need to rank higher</CardDescription>
                            <div className="mt-4">
                                <span className="text-5xl font-bold">$19.99</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-700"><Check className="w-3 h-3" /></div>
                                    <span>Unlimited Tool Access</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-700"><Check className="w-3 h-3" /></div>
                                    <span>Unlock All Metrics & Fixes</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-700"><Check className="w-3 h-3" /></div>
                                    <span>Deep Technical Audits</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-700"><Check className="w-3 h-3" /></div>
                                    <span>AI Content Rewrites</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 p-1 rounded-full text-green-700"><Check className="w-3 h-3" /></div>
                                    <span>Competitor Analysis</span>
                                </li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full h-12 text-lg shadow-lg shadow-primary/20" asChild>
                                <Link href="/checkout">Upgrade Now</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                </div>
            </main>
        </div>
    )
}
