"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
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
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
                            <div className="text-slate-500 text-sm">
                                <p>Last Updated: January 30, 2026</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                Welcome to GEOOX. By accessing our website and using our 18 GEO tools, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Subscription & Billing</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>Plan Details:</strong> Access to the GEOOX suite is provided on a monthly subscription basis for $19.99 USD.</li>
                                <li><strong>Payment:</strong> Payments are processed automatically every 30 days. You will receive an automated invoice in your Billing History section for every transaction.</li>
                                <li><strong>Price Changes:</strong> We reserve the right to adjust pricing; however, existing subscribers will be notified at least 30 days in advance of any changes.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Cancellation & Refund Policy</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>Cancel Anytime:</strong> You may cancel your subscription at any time through your Account Dashboard. Upon cancellation, you will retain access to the tools until the end of your current billing period.</li>
                                <li><strong>No Refunds:</strong> Due to the digital nature of our tools and the immediate value provided (e.g., downloadable llms.txt and Schema files), we do not offer refunds for partial months or unused time.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Use of Tools & Content</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>License:</strong> We grant you a non-exclusive, non-transferable license to use our 18 tools for your own websites or client projects.</li>
                                <li><strong>Automated Crawling:</strong> You agree not to use our tools to maliciously scrape or &quot;DDOS&quot; other websites. Our tools must be used in compliance with the robots.txt and llms.txt files of target domains.</li>
                                <li><strong>Prohibited Use:</strong> You may not resell access to your GEOOX account or use our tools to generate illegal, harmful, or deceptive content.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Nature of AI Results (GEO)</h3>
                            <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-600">
                                <li><strong>No Guarantee of Rankings:</strong> While GEOOX is designed to optimize your site for Generative Engines (Gemini, ChatGPT, Perplexity, etc.), we do not guarantee specific ranking positions or citation rates. AI models are third-party entities, and their algorithms change frequently.</li>
                                <li><strong>Accuracy:</strong> Our tools provide suggestions based on current 2026 machine learning trends. The final implementation and its impact on your site’s performance are the user responsible.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Limitation of Liability</h3>
                            <p className="text-slate-600 mb-6">
                                GEOOX shall not be held liable for any indirect, incidental, or consequential damages resulting from the use of our tools, including but not limited to loss of search engine rankings, data loss, or server downtime. Our total liability is limited to the amount paid by you for the service in the last 12 months.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Account Security</h3>
                            <p className="text-slate-600 mb-6">
                                You are responsible for maintaining the confidentiality of your account credentials. Any activity performed under your account is your responsibility. If you suspect unauthorized access, contact <span className="text-blue-600">support@geoox.com</span> immediately.
                            </p>

                            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Changes to Terms</h3>
                            <p className="text-slate-600 mb-6">
                                GEOOX reserves the right to modify these terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the new terms.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
