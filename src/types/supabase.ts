export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          classes_included: string | null
          created_at: string
          event_site: string | null
          id: number
          instructors: string | null
          label: string | null
          location_link: string | null
          start_time: string | null
          venue: string | null
        }
        Insert: {
          classes_included?: string | null
          created_at?: string
          event_site?: string | null
          id?: number
          instructors?: string | null
          label?: string | null
          location_link?: string | null
          start_time?: string | null
          venue?: string | null
        }
        Update: {
          classes_included?: string | null
          created_at?: string
          event_site?: string | null
          id?: number
          instructors?: string | null
          label?: string | null
          location_link?: string | null
          start_time?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      events_votes: {
        Row: {
          created_at: string
          event_id: number
          id: string
          vote: number
        }
        Insert: {
          created_at: string
          event_id: number
          id: string
          vote: number
        }
        Update: {
          created_at?: string
          event_id?: number
          id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_votes_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_votes_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      songs: {
        Row: {
          added_by: string | null
          author: string | null
          categories: Json
          created_at: string
          downvotes: number | null
          id: number
          image_path: string | null
          song_path: string | null
          title: string | null
          upvotes: number | null
        }
        Insert: {
          added_by?: string | null
          author?: string | null
          categories: Json
          created_at?: string
          downvotes?: number | null
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
          upvotes?: number | null
        }
        Update: {
          added_by?: string | null
          author?: string | null
          categories?: Json
          created_at?: string
          downvotes?: number | null
          id?: number
          image_path?: string | null
          song_path?: string | null
          title?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_added_by_fkey"
            columns: ["added_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      songs_votes: {
        Row: {
          created_at: string
          id: string
          song_id: number
          vote: number
        }
        Insert: {
          created_at: string
          id: string
          song_id: number
          vote: number
        }
        Update: {
          created_at?: string
          id?: string
          song_id?: number
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "songs_votes_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songs_votes_song_id_fkey"
            columns: ["song_id"]
            referencedRelation: "songs"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          email: string | null
          email: string | null
          full_name: string | null
          id: string
          payment_method: Json | null
          votes_bachata_songs: Json[] | null
          votes_events: Json[] | null
          votes_salsa_songs: Json[] | null
          votes_zouk_songs: Json[] | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          email?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
          votes_bachata_songs?: Json[] | null
          votes_events?: Json[] | null
          votes_salsa_songs?: Json[] | null
          votes_zouk_songs?: Json[] | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          email?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
          votes_bachata_songs?: Json[] | null
          votes_events?: Json[] | null
          votes_salsa_songs?: Json[] | null
          votes_zouk_songs?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
