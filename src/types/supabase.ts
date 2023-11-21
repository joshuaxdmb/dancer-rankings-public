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
      classes_by_instructor: {
        Row: {
          created_at: string
          duration_in_minutes: number | null
          for_dance_level: string
          for_dance_role: Database["public"]["Enums"]["dance_roles"]
          genre: string
          id: number
          instructor_id: number
          title: string | null
        }
        Insert: {
          created_at?: string
          duration_in_minutes?: number | null
          for_dance_level: string
          for_dance_role: Database["public"]["Enums"]["dance_roles"]
          genre: string
          id?: number
          instructor_id: number
          title?: string | null
        }
        Update: {
          created_at?: string
          duration_in_minutes?: number | null
          for_dance_level?: string
          for_dance_role?: Database["public"]["Enums"]["dance_roles"]
          genre?: string
          id?: number
          instructor_id?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_by_instructor_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          }
        ]
      }
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
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          classes_included: string | null
          created_at: string
          end_time: string
          event_location: string
          event_site: string | null
          id: number
          image_path: string | null
          instructors: string | null
          label: string | null
          location_link: string | null
          start_time: string
          venue: string | null
        }
        Insert: {
          classes_included?: string | null
          created_at?: string
          end_time: string
          event_location: string
          event_site?: string | null
          id?: number
          image_path?: string | null
          instructors?: string | null
          label?: string | null
          location_link?: string | null
          start_time: string
          venue?: string | null
        }
        Update: {
          classes_included?: string | null
          created_at?: string
          end_time?: string
          event_location?: string
          event_site?: string | null
          id?: number
          image_path?: string | null
          instructors?: string | null
          label?: string | null
          location_link?: string | null
          start_time?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_event_location_fkey"
            columns: ["event_location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          }
        ]
      }
      events_votes: {
        Row: {
          created_at: string
          event_id: number
          user_id: string
          vote: number
        }
        Insert: {
          created_at: string
          event_id: number
          user_id: string
          vote: number
        }
        Update: {
          created_at?: string
          event_id?: number
          user_id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      instructors: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: number
          image_url: string | null
          instagram_id: string | null
          last_name: string
          phone_number: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: number
          image_url?: string | null
          instagram_id?: string | null
          last_name: string
          phone_number?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: number
          image_url?: string | null
          instagram_id?: string | null
          last_name?: string
          phone_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          id: number
          location_id: string
        }
        Insert: {
          id?: number
          location_id: string
        }
        Update: {
          id?: number
          location_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          consumed_at: string | null
          created: string
          id: string
          metadata: Json | null
          price_id: string | null
          product_name: string | null
          quantity: number | null
          user_id: string
        }
        Insert: {
          consumed_at?: string | null
          created?: string
          id: string
          metadata?: Json | null
          price_id?: string | null
          product_name?: string | null
          quantity?: number | null
          user_id: string
        }
        Update: {
          consumed_at?: string | null
          created?: string
          id?: string
          metadata?: Json | null
          price_id?: string | null
          product_name?: string | null
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      playlist_song_map: {
        Row: {
          added_by: string | null
          created_at: string
          id: number
          playlist_id: string | null
          song_spotify_id: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string
          id?: number
          playlist_id?: string | null
          song_spotify_id?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string
          id?: number
          playlist_id?: string | null
          song_spotify_id?: string | null
        }
        Relationships: []
      }
      playlists: {
        Row: {
          created_at: string | null
          id: number
          owner_id: string | null
          playlist_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          owner_id?: string | null
          playlist_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          owner_id?: string | null
          playlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlists_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
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
            isOneToOne: false
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
          created_at: string
          image_path: string | null
          preview_url: string | null
          spotify_id: string
          title: string | null
        }
        Insert: {
          added_by?: string | null
          author?: string | null
          created_at?: string
          image_path?: string | null
          preview_url?: string | null
          spotify_id: string
          title?: string | null
        }
        Update: {
          added_by?: string | null
          author?: string | null
          created_at?: string
          image_path?: string | null
          preview_url?: string | null
          spotify_id?: string
          title?: string | null
        }
        Relationships: []
      }
      songs_votes: {
        Row: {
          created_at: string
          location_id: string
          playlist_id: string
          song_spotify_id: string
          user_id: string
          vote: number
        }
        Insert: {
          created_at?: string
          location_id: string
          playlist_id: string
          song_spotify_id: string
          user_id: string
          vote: number
        }
        Update: {
          created_at?: string
          location_id?: string
          playlist_id?: string
          song_spotify_id?: string
          user_id?: string
          vote?: number
        }
        Relationships: [
          {
            foreignKeyName: "songs_votes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "songs_votes_song_spotify_id_fkey"
            columns: ["song_spotify_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "songs_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          default_location: string
          email: string | null
          email: string | null
          follow_level: Database["public"]["Enums"]["dance_levels"] | null
          full_name: string | null
          gender: Database["public"]["Enums"]["genders"]
          id: string
          lead_level: Database["public"]["Enums"]["dance_levels"] | null
          payment_method: Json | null
          primary_dance_role: Database["public"]["Enums"]["dance_roles"]
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          default_location: string
          email?: string | null
          email?: string | null
          follow_level?: Database["public"]["Enums"]["dance_levels"] | null
          full_name?: string | null
          gender: Database["public"]["Enums"]["genders"]
          id: string
          lead_level?: Database["public"]["Enums"]["dance_levels"] | null
          payment_method?: Json | null
          primary_dance_role: Database["public"]["Enums"]["dance_roles"]
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          default_location?: string
          email?: string | null
          email?: string | null
          follow_level?: Database["public"]["Enums"]["dance_levels"] | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["genders"]
          id?: string
          lead_level?: Database["public"]["Enums"]["dance_levels"] | null
          payment_method?: Json | null
          primary_dance_role?: Database["public"]["Enums"]["dance_roles"]
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
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
      get_voted_events: {
        Args: {
          p_location_id: string
        }
        Returns: {
          id: number
          label: string
          venue: string
          location_link: string
          image_path: string
          event_site: string
          start_time: string
          classes_included: string
          end_time: string
          event_location: string
          total_votes: number
        }[]
      }
      get_voted_songs: {
        Args: {
          p_playlist_id: string
          p_location_id: string
        }
        Returns: {
          spotify_id: string
          added_by: string
          author: string
          image_path: string
          title: string
          preview_url: string
          playlist_id: string
          location_id: string
          up_votes: number
          down_votes: number
          total_votes: number
        }[]
      }
    }
    Enums: {
      dance_levels:
        | "beginner1"
        | "beginner2"
        | "intermediate1"
        | "intermediate2"
        | "advanced"
      dance_roles: "Lead" | "Follow" | "Both"
      genders: "Male" | "Female" | "X"
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
