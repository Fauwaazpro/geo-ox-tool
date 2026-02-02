"use client"

import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

interface PremiumLockProps {
    isLocked: boolean
    title?: string
    children: React.ReactNode
    blur?: boolean
}

export function PremiumLock({
    isLocked,
    title = "Upgrade to Unlock",
    children,
    blur = true
}: PremiumLockProps) {
    if (!isLocked) {
        return <>{children}</>
    }

    return (
        <div className="relative overflow-hidden rounded-lg group">
            {/* Blured Content Layer */}
            <div className={`transition-all duration-300 ${blur ? 'blur-md opacity-50 select-none pointer-events-none' : 'opacity-0'}`}>
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-background/60 backdrop-blur-sm border-2 border-dashed border-slate-200 rounded-lg">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-6 shadow-inner">
                    <Lock className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit">{title}</h3>
                <p className="text-slate-500 max-w-[300px] mb-8 leading-relaxed">
                    This advanced feature is available exclusively to Premium members.
                </p>
                <Link href="/pricing" className="w-full max-w-sm">
                    <Button size="lg" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg border-0">
                        <Lock className="w-4 h-4 mr-2" />
                        {title || "Upgrade to Unlock"} - $19.99
                    </Button>
                </Link>
                <div className="mt-2 text-xs text-slate-500">
                    Secure payment • Cancel anytime
                </div>
            </div>
        </div >
    )
}
