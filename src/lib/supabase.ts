import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          id: string
          name: string
          service: string
          key: string
          category: string
          description: string | null
          expiration: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          service: string
          key: string
          category: string
          description?: string | null
          expiration?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          service?: string
          key?: string
          category?: string
          description?: string | null
          expiration?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
