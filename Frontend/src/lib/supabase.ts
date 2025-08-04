import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for the iipc_data table
export interface IIPCData {
  id: number
  ark_url: string
  title: string
  date: string
  creator: string
  subject: string
  description: string
  item_type: string
  source_url: string
  full_text: string
  cleaned_text: string
  created_at: string
} 