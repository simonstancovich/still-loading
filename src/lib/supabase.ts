import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface GiftRow {
  id: string
  word: string
  x_position: number
  y_position: number
  created_at: string
  approved: boolean
  flagged_reason: string | null
  visitor_hash: string | null
}

export interface SessionRow {
  id: string
  started_at: string
  ended_at: string | null
  reached_ritual: boolean
  gave_love: boolean
  long_tail_unlocked: boolean
  visitor_hash: string
}

export interface Database {
  public: {
    Tables: {
      gifts: { Row: GiftRow; Insert: Omit<GiftRow, 'id' | 'created_at'>; Update: Partial<GiftRow> }
      sessions: {
        Row: SessionRow
        Insert: Omit<SessionRow, 'id' | 'started_at'>
        Update: Partial<SessionRow>
      }
    }
  }
}

let cachedClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (cachedClient) return cachedClient
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  }
  cachedClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 5 } },
  })
  return cachedClient
}
