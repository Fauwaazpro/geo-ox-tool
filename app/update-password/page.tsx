"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, KeyRound } from "lucide-react"

export default function UpdatePasswordPage() {
    const router = useRouter()
    const supabase = createClient()
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setMessage("Error: " + error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="w-full max-w-[400px]">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                        <KeyRound className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
                    <p className="text-slate-500 mt-2">Please enter your new password below.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="sr-only">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                        />
                    </div>

                    {message && (
                        <div className="p-3 rounded-md text-sm bg-red-50 text-red-600">
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 font-semibold text-lg shadow-lg shadow-purple-500/20" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
