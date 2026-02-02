"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)

    // Handle scroll to add blur effect
    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            setIsScrolled(window.scrollY > 10)
        })
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass border-b border-border/40"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">G</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">GEO Ox</span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                        Pricing
                    </Link>
                    <Link href="/#tools" className="text-sm font-medium hover:text-primary transition-colors">
                        Tools
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button size="sm" className="shadow-glow">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
