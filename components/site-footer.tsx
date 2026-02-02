import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="opacity-90">
                                <Image
                                    src="/images/geo-ox-logo.png"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain invert brightness-200"
                                />
                            </div>
                            <span className="font-bold text-xl text-white font-orbitron tracking-widest">GEO Ox</span>
                        </div>
                        <p className="max-w-xs text-slate-400">
                            The ultimate solution to make websites AI-friendly, future-proof, and optimized for modern search engines.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link href="/dashboard" className="hover:text-white transition-colors">Tools</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© 2026 GEO Ox Platform. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
