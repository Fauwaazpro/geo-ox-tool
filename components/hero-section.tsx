"use client"

import { useState } from "react"
import { ParticleBackground } from "./particle-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, ArrowRight } from "lucide-react"

export function HeroSection() {
    const [url, setUrl] = useState("")

    const handleAudit = () => {
        if (url) {
            window.location.href = `/dashboard?url=${encodeURIComponent(url)}`
        }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <ParticleBackground />

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background -z-5" />

            <div className="container mx-auto px-4 py-32 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Powered by AI & Data Science</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                        Optimize for the
                        <br />
                        <span className="text-gradient">Age of AI</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        18 precision-engineered tools for GEO and SEO. Fast, accurate, and built to instill confidence.
                    </p>

                    {/* CTA Input */}
                    <div className="max-w-2xl mx-auto">
                        <div className="glass p-2 rounded-xl border border-primary/20 shadow-premium">
                            <div className="flex gap-2">
                                <Input
                                    type="url"
                                    placeholder="Enter URL to audit..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                                    className="border-0 bg-white/50 backdrop-blur-sm text-lg h-14 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Button
                                    onClick={handleAudit}
                                    size="lg"
                                    className="h-14 px-8 text-base"
                                >
                                    Analyze
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                            No credit card required • 3 free tools • Instant results
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
                        <div>
                            <div className="text-3xl font-bold text-gradient">18</div>
                            <div className="text-sm text-muted-foreground">Specialized Tools</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gradient">99.9%</div>
                            <div className="text-sm text-muted-foreground">Accuracy</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gradient">&lt;2s</div>
                            <div className="text-sm text-muted-foreground">Avg Analysis</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
