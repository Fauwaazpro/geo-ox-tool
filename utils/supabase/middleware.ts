import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. Initialize response ONCE.
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // 2. Safety Check: If env vars are missing, log and skip (prevents crash).
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Middleware: Missing Supabase Env Vars. Skipping auth.")
        return response
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    get(name: string) {
                        // Read from the response first (in case we just set it), then request.
                        return response.cookies.get(name)?.value ?? request.cookies.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        // Only update the response. Do not mutate request (avoids ReadOnly check errors).
                        // Do not recreate response here (avoids clobbering previous cookies).
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        // Only update the response.
                        response.cookies.set({
                            name,
                            value: '',
                            ...options,
                        })
                    },
                },
            }
        )

        // 3. Refresh Session (This will call set/remove if needed)
        const { data: { user }, error } = await supabase.auth.getUser()

        // 4. Protect Routes
        if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/account')) {
            if (error || !user) {
                const url = request.nextUrl.clone()
                url.pathname = '/login'
                url.searchParams.set('return_to', request.nextUrl.pathname)
                return NextResponse.redirect(url)
            }
        }

    } catch (e) {
        // Catch any unforeseen errors to prevent 500 Middleware Invocation Failed
        console.error("Middleware Critical Error:", e)
        // Ensure we return a valid response even on error
    }

    return response
}
