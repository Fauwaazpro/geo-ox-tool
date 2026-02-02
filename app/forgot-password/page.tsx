"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
    const supabase = createClient()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/auth/callback?next=/update-password`,
        })

        if (error) {
            setMessage("Error: " + error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <div className="w-full max-w-[400px] text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
                    <p className="text-slate-500 mb-8">
                        We've sent a password reset link to <span className="font-semibold text-slate-900">{email}</span>
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <div className="w-full max-w-[400px] p-4">
                <div className="mb-8">
                    <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 flex items-center mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                    </Link>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
                    <p className="text-slate-500 mt-2">No worries, we'll send you reset instructions.</p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="sr-only">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                        />
                    </div>

                    {message && (
                        <div className="p-3 rounded-md text-sm bg-red-50 text-red-600">
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-semibold text-lg shadow-lg shadow-blue-500/20" disabled={loading}>
                        {loading ? "Sending..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
