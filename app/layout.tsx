import type { Metadata } from "next";
// import { Inter, Outfit, Orbitron } from "next/font/google"; // Disabled to prevent build timeout
import "./globals.css";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I'll inline the class join
import { SiteFooter } from "@/components/site-footer"
import { ChatWidget } from "@/components/chat-widget"
import { CookieConsent } from "@/components/cookie-consent"

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
// const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" }); // Futuristic

export const metadata: Metadata = {
    title: {
        default: "GEO Ox - Optimize for the Age of AI",
        template: "%s | GEO Ox"
    },
    description: "Premium SaaS platform with 18 specialized tools for AI (GEO) and SEO optimization. Fast, accurate, and confidence-inspiring.",
    keywords: ["GEO", "SEO", "AI optimization", "generative engine optimization", "llms.txt", "schema generator", "content scoring"],
    authors: [{ name: "GEO-OX Team" }],
    creator: "GEO-OX",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://geo-ox.com",
        title: "GEO Ox - Optimize for the Age of AI",
        description: "Dominate search in the age of AI with our comprehensive GEO & SEO toolkit.",
        siteName: "GEO Ox",
    },
    twitter: {
        card: "summary_large_image",
        title: "GEO Ox - AI & SEO Optimization Platform",
        description: "Optimize your content for ChatGPT, Claude, Perplexity and Google.",
        creator: "@geo_ox",
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Orbitron:wght@400..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
            </head>
            <body className={`font-sans antialiased min-h-screen bg-slate-50 flex flex-col`}>
                <div className="flex-1">
                    {children}
                </div>
                <SiteFooter />
                <ChatWidget />
                <CookieConsent />
            </body>
        </html>
    );
}
