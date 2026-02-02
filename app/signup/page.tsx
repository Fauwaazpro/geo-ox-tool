"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock } from "lucide-react"

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <div className="w-full max-w-[400px] p-4 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-500">
                    <Lock className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Sign up is currently disabled</h1>
                <p className="text-slate-500 mb-8">
                    We are currently not accepting new account registrations. Please check back later.
                </p>
                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}
