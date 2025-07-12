import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          points: number
          role: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          points?: number
          role?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          points?: number
          role?: string
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category_id: string
          type: string
          size: string
          condition: string
          tags: string[]
          images: string[]
          points_value: number
          status: string
          is_available: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category_id: string
          type: string
          size: string
          condition: string
          tags?: string[]
          images?: string[]
          points_value?: number
          status?: string
          is_available?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category_id?: string
          type?: string
          size?: string
          condition?: string
          tags?: string[]
          images?: string[]
          points_value?: number
          status?: string
          is_available?: boolean
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      swap_requests: {
        Row: {
          id: string
          requester_id: string
          owner_id: string
          requested_item_id: string
          offered_item_id: string | null
          swap_type: string
          points_offered: number | null
          status: string
          message: string | null
          shipping_method: string | null
          shipping_address: string | null
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          owner_id: string
          requested_item_id: string
          offered_item_id?: string | null
          swap_type: string
          points_offered?: number | null
          status?: string
          message?: string | null
          shipping_method?: string | null
          shipping_address?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          owner_id?: string
          requested_item_id?: string
          offered_item_id?: string | null
          swap_type?: string
          points_offered?: number | null
          status?: string
          message?: string | null
          shipping_method?: string | null
          shipping_address?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          related_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          read?: boolean
          related_id?: string | null
          created_at?: string
        }
      }
      user_points_history: {
        Row: {
          id: string
          user_id: string
          points_change: number
          reason: string
          related_item_id: string | null
          related_swap_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points_change: number
          reason: string
          related_item_id?: string | null
          related_swap_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points_change?: number
          reason?: string
          related_item_id?: string | null
          related_swap_id?: string | null
          created_at?: string
        }
      }
    }
  }
} 