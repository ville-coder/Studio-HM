import { createClient } from '@supabase/supabase-js'

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase-ympäristömuuttujat puuttuvat.')
  supabaseUrl = 'https://placeholder.supabase.co'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder')
