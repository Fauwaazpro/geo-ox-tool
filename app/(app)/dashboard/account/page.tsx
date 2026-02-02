"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePremium } from "@/hooks/use-premium"
import { LogOut, User, ShieldCheck, FileText, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock Billing Data (Only shown for Premium Users)
const INVOICES = [
    { id: "INV-2024-001", date: "Jan 01, 2024", amount: "$19.99", status: "Paid" },
    { id: "INV-2023-012", date: "Dec 01, 2023", amount: "$19.99", status: "Paid" },
]

export default function AccountPage() {
    const router = useRouter()
    const supabase = createClient()
    const { isPremium } = usePremium()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState<string | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        getUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleDownloadInvoice = (id: string) => {
        setDownloading(id)
        // Simulate PDF generation delay
        setTimeout(() => {
            setDownloading(null)
            alert(`Invoice ${id} downloaded successfully!`)
        }, 1500)
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading account details...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>

            {/* Profile Information */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <div className="font-mono bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                            {user?.email}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">User ID</label>
                        <div className="font-mono text-xs text-slate-400 mt-1">
                            {user?.id}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Subscription Plan */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        Subscription Plan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xl font-bold mb-1">
                                {isPremium ? "GEO UP Premium" : "Free Starter"}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {isPremium
                                    ? "You have full access to all tools and features."
                                    : "Upgrade to unlock advanced metrics and higher limits."}
                            </p>
                        </div>
                        {!isPremium && (
                            <Button onClick={() => router.push('/pricing')} className="bg-gradient-primary">
                                Upgrade Plan
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Billing History (Premium Only) */}
            {isPremium && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Billing History
                        </CardTitle>
                        <CardDescription>Download your past invoices.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-slate-200 overflow-hidden">
                            <div className="grid grid-cols-4 p-3 bg-slate-50 border-b border-slate-200 font-medium text-xs text-slate-600 uppercase tracking-wide">
                                <div className="col-span-1">Date</div>
                                <div className="col-span-1">Amount</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-1 text-right">Invoice</div>
                            </div>
                            {INVOICES.map((inv) => (
                                <div key={inv.id} className="grid grid-cols-4 p-3 items-center text-sm border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <div className="text-slate-700">{inv.date}</div>
                                    <div className="font-medium text-slate-900">{inv.amount}</div>
                                    <div>
                                        <Badge variant="secondary" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                                            {inv.status}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleDownloadInvoice(inv.id)}
                                            disabled={downloading === inv.id}
                                        >
                                            {downloading === inv.id ? (
                                                <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Download className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Button variant="destructive" onClick={handleSignOut} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
            </Button>
        </div>
    )
}
