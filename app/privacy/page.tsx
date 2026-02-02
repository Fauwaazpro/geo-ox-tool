"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
            {/* Header / Nav - Consistent with other pages */}
            <header className="fixed top-0 w-full z-50 glass border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
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
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
                        <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contact</Link>
                        <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <Button className="font-semibold shadow-lg shadow-blue-500/20">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">

                        {/* Title Section */}
                        <div className="mb-12 border-b border-slate-100 pb-8">
                            <Badge variant="outline" className="mb-4 border-blue-200 bg-blue-50 text-blue-700">Legal</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                            <div className="text-slate-500 text-sm">
                                <p>Effective Date: January 30, 2026</p>
                                <p>Last Updated: January 30, 2026</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                At GEOOX, your privacy is our priority. This policy explains how we collect, use, and protect your data when you use our 18 GEO tools and subscription services.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h3>
                            <p className="mb-4">To provide our AI optimization services, we collect the following types of information:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>Account Data:</strong> Name, email address, and password when you create an account.</li>
                                <li><strong>Billing & Transaction Data:</strong> We use third-party processors to handle payments. We do not store your full credit card number, but we retain billing history and address details to generate your monthly invoices.</li>
                                <li><strong>Website Data:</strong> URLs, metadata, and content you submit for analysis via our tools (e.g., the llms.txt generator).</li>
                                <li><strong>Usage Data:</strong> IP addresses, browser types, and interaction logs to improve tool performance and prevent bot abuse.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Data</h3>
                            <p className="mb-4">We process your information for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>Service Delivery:</strong> To run the 18 GEO tools (Schema generation, Gap analysis, etc.).</li>
                                <li><strong>Billing:</strong> To process your $19.99/month subscription and provide downloadable invoices.</li>
                                <li><strong>AI Training Disclosure:</strong> We do not use your private website data to train general public AI models. Your data is used solely to generate reports for your account.</li>
                                <li><strong>Communication:</strong> To send you technical updates or support responses.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Retention & Storage</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>Active Subscriptions:</strong> We retain your account and billing data as long as your subscription is active.</li>
                                <li><strong>Invoices:</strong> Financial records are kept for 7 years to comply with international tax laws.</li>
                                <li><strong>Tool History:</strong> Reports and crawled data are stored for 90 days before being archived or deleted, unless otherwise requested.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Your Rights (GDPR & CCPA)</h3>
                            <p className="mb-4">You have full control over your data. You may:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>Access & Export:</strong> Download a copy of your personal data and billing history at any time.</li>
                                <li><strong>Correction:</strong> Update your account details via the Settings page.</li>
                                <li><strong>Erasure (Right to be Forgotten):</strong> Request the deletion of your account and all associated tool data.</li>
                                <li><strong>Cancel Anytime:</strong> You can terminate your subscription instantly; we will stop all future billing immediately.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Security Measures</h3>
                            <p className="mb-4">We implement industry-standard security to keep your site data safe:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</li>
                                <li><strong>Secure Payments:</strong> All transactions are handled via compliant providers.</li>
                                <li><strong>Access Control:</strong> Only authorized GEOOX engineers can access the backend for support purposes.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Cookies & Tracking</h3>
                            <p className="text-slate-600">
                                We use essential cookies to keep you logged in and functional cookies to remember your tool preferences. We do not sell your data to third-party advertisers.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
