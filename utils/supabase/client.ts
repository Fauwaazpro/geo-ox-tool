import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Creating Supabase client with empty keys to prevent build crash.')
        return createBrowserClient('https://placeholder.supabase.co', 'placeholder')
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
