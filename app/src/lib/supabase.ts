import { createClient, SupabaseClient } from '@supabase/supabase-js'

// These will be set from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with placeholder values - the hooks will check if it's actually configured
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'proceshuis-hsf',
    },
  },
})

// Helper to check if Supabase is actually configured (not using placeholder)
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!(url && url !== 'https://placeholder.supabase.co' && url !== 'your_supabase_project_url')
}

// Note: Configure these environment variables in .env.local:
// NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
