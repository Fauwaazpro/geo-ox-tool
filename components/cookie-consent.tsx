"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Cookie, X } from "lucide-react"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already accepted
        const consent = localStorage.getItem("geoox-cookie-consent")
        if (!consent) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        setIsVisible(false)
        localStorage.setItem("geoox-cookie-consent", "true")
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-[60] max-w-sm w-full animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                        <Cookie className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold text-slate-900">We use cookies</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            We use cookies to enhance your experience and analyze platform traffic.
                            By continuing, you agree to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 translate-y-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsVisible(false)} // Just hide for session if closed without accept? Or full reject? Usually Accept is main action.
                        className="text-slate-500 hover:text-slate-900 h-9"
                    >
                        Close
                    </Button>
                    <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 h-9 px-6"
                        onClick={handleAccept}
                    >
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    )
}
