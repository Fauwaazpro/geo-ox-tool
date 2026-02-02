import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // 1. Auth Callback - Always allow it to pass through
    // We want to ensure Vercel sees this route is "active".
    if (path.startsWith('/auth')) {
        return NextResponse.next()
    }

    // 2. Protected Routes (Dashboard/Account) - Run Update Session
    // This maintains the "scoped" approach to prevent crashes on the homepage
    if (path.startsWith('/dashboard') || path.startsWith('/account')) {
        try {
            return await updateSession(request)
        } catch (e) {
            console.error("Middleware Error on Protected Route:", e)
            return NextResponse.next()
        }
    }

    // 3. Default: Pass through for everything else (Homepage, Public)
    return NextResponse.next()
}

export const config = {
    // Matcher: Include everything so we can control logic in the function above.
    // This ensures we don't accidentally "exclude" the auth callback from existence.
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
