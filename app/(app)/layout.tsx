import type { Metadata } from "next"
import { DashboardNav } from "@/components/dashboard-nav"

export const metadata: Metadata = {
    title: "Dashboard - GEO Ox",
    description: "Access all 18 GEO and SEO optimization tools",
}

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <DashboardNav />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
