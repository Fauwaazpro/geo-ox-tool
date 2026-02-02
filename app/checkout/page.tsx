"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowLeft, CreditCard, CheckCircle } from "lucide-react"
import { usePremium } from "@/hooks/use-premium"

export default function CheckoutPage() {
    const router = useRouter()
    const { setPremium } = usePremium()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate payment processing
        setTimeout(() => {
            setPremium(true)
            setLoading(false)
            setSuccess(true)

            // Redirect after showing success
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        }, 1500)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Card className="w-full max-w-md text-center p-8">
                    <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-muted-foreground mb-4">Welcome to GEO Ox Pro. Redirecting you to the dashboard...</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <Link href="/pricing" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Plans
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
                    <p className="text-muted-foreground mt-2">Secure subscribe to GEO Ox Pro</p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-sm">
                                <span>GEO Ox Pro Monthly</span>
                                <span className="font-bold">$19.99</span>
                            </div>
                            <div className="border-t my-4 pt-4 flex justify-between items-center font-bold">
                                <span>Total due today</span>
                                <span>$19.99</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Encrypted and Secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Cardholder Name</Label>
                                    <Input id="name" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card">Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="card" placeholder="0000 0000 0000 0000" className="pl-9" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry</Label>
                                        <Input id="expiry" placeholder="MM/YY" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" required />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-11 text-lg mt-4" disabled={loading}>
                                    {loading ? "Processing..." : "Pay $19.99"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="justify-center">
                            <p className="text-xs text-muted-foreground text-center">
                                By clicking Pay, you allow GEO Ox to charge your card $19.99 monthly. Cancel anytime.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
