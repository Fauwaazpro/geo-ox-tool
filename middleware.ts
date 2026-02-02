import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    // PASS-THROUGH ONLY
    // This exists to satisfy Vercel's routing infrastructure.
    // Auth checks are disabled here to prevent 500 errors.
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (svg, png, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
