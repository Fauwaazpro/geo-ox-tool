import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    // EMERGENCY OVERRIDE: 
    // The previous auth logic was causing 500 crashes on Vercel.
    // We are temporarily disabling middleware to get the site ONLINE.
    // Auth protection will happen on the page level or client-side for now.
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
