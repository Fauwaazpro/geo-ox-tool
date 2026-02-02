import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // OPTIMIZATION: Skip middleware logic completely for public assets and public pages
    // This reduces Edge Function invocations and prevents crashes on static pages.
    const path = request.nextUrl.pathname

    // List of public paths that DEFINITELY don't need auth checking
    if (path === '/' || path.startsWith('/api/') || path.startsWith('/login') || path.startsWith('/pricing')) {
        // Technically we should refresh session on all routes for "getUser" to work on client, 
        // BUT if the site is crashing, we intentionally skip it for the home page to keep the site ALIVE.
        // Once the crash is resolved, we can enable it back.
        // For now: prioritising UPTIME.
        return NextResponse.next()
    }

    try {
        return await updateSession(request)
    } catch (e) {
        console.error("Middleware Error:", e)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

