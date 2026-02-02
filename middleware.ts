import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Pass-Through (Logic Disabled for Stability)
    return NextResponse.next()
}

export const config = {
    // 2. EXTREME SCOPING: ONLY run on protected routes.
    // This explicitly EXCLUDES the homepage ('/') and all other public pages.
    // The middleware will NOT even invoke for the landing page.
    matcher: [
        '/dashboard/:path*',
        '/account/:path*',
    ],
}
