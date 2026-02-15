import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL. Set it in your .env.local file or Vercel environment variables.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in your .env.local file or Vercel environment variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
