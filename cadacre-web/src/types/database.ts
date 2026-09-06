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
      reits: {
        Row: {
          ticker: string
          name: string
          sector: string
          market_cap: number | null
          yield_pct: number | null
          nta_premium_discount: number | null
          gearing_pct: number | null
          wale_years: number | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          ticker: string
          name: string
          sector: string
          market_cap?: number | null
          yield_pct?: number | null
          nta_premium_discount?: number | null
          gearing_pct?: number | null
          wale_years?: number | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          ticker?: string
          name?: string
          sector?: string
          market_cap?: number | null
          yield_pct?: number | null
          nta_premium_discount?: number | null
          gearing_pct?: number | null
          wale_years?: number | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      assets: {
        Row: {
          id: string
          reit_ticker: string | null
          address: string
          suburb: string
          state: string
          postcode: string | null
          location: any | null // PostGIS geometry
          property_type: string | null
          book_value: number | null
          acquired_year: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          reit_ticker?: string | null
          address: string
          suburb: string
          state: string
          postcode?: string | null
          location?: any | null
          property_type?: string | null
          book_value?: number | null
          acquired_year?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          reit_ticker?: string | null
          address?: string
          suburb?: string
          state?: string
          postcode?: string | null
          location?: any | null
          property_type?: string | null
          book_value?: number | null
          acquired_year?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      announcements: {
        Row: {
          id: string
          reit_ticker: string | null
          title: string
          published_at: string
          source_url: string
          is_price_sensitive: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          reit_ticker?: string | null
          title: string
          published_at: string
          source_url: string
          is_price_sensitive?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          reit_ticker?: string | null
          title?: string
          published_at?: string
          source_url?: string
          is_price_sensitive?: boolean | null
          created_at?: string | null
        }
      }
      user_alerts: {
        Row: {
          id: string
          user_id: string
          reit_ticker: string | null
          metric: string
          operator: string
          threshold_value: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          reit_ticker?: string | null
          metric: string
          operator: string
          threshold_value?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          reit_ticker?: string | null
          metric?: string
          operator?: string
          threshold_value?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
