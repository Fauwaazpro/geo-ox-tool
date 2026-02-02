import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    try {
        // Safe mode check: If env vars are missing, bypass auth to prevent crash
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.warn("Middleware: Skipping auth check due to missing env vars")
            return NextResponse.next()
        }

        let response = await updateSession(request)

        // Protect dashboard and account routes
        if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/account')) {
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                {
                    cookies: {
                        get(name: string) {
                            return request.cookies.get(name)?.value
                        },
                    },
                }
            )
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }

        return response
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

