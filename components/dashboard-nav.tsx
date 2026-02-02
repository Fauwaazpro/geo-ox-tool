"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePremium } from "@/hooks/use-premium"
import { LayoutDashboard, UserCircle, LogOut, ArrowUpCircle } from "lucide-react"

export function DashboardNav() {
    const pathname = usePathname()
    const { isPremium } = usePremium()

    return (
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
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

                <div className="flex items-center space-x-2 md:space-x-6">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link href="/dashboard">
                            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} size="sm">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/dashboard/account">
                            <Button variant={pathname === "/dashboard/account" ? "secondary" : "ghost"} size="sm">
                                <UserCircle className="w-4 h-4 mr-2" />
                                Account
                            </Button>
                        </Link>
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        {!isPremium && (
                            <Link href="/pricing">
                                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                                    Upgrade to Pro
                                </Button>
                            </Link>
                        )}
                        <Link href="/dashboard/account" className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <UserCircle className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
