export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          display_date: string | null
          excerpt: string
          featured: boolean
          handle: string
          id: string
          image: string | null
          image_alt: string | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          read_time: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          display_date?: string | null
          excerpt?: string
          featured?: boolean
          handle: string
          id: string
          image?: string | null
          image_alt?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          read_time?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          display_date?: string | null
          excerpt?: string
          featured?: boolean
          handle?: string
          id?: string
          image?: string | null
          image_alt?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          read_time?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string
          handle: string
          id: string
          image: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          parent_id: string | null
          sort_order: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          handle: string
          id: string
          image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          parent_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          handle?: string
          id?: string
          image?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          parent_id?: string | null
          sort_order?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_events: {
        Row: {
          body: string
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json | null
          recipient_email: string | null
          status: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          recipient_email?: string | null
          status?: string
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          recipient_email?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          enabled: boolean
          id: boolean
          recipient_email: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          id?: boolean
          recipient_email?: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          id?: boolean
          recipient_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          compare_at_price: number | null
          created_at: string
          description: string
          handle: string
          id: string
          image: string | null
          image_alt: string | null
          images: Json
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image: string | null
          options: Json
          price: number
          price_range: string | null
          rating: number | null
          status: string
          stock: number
          updated_at: string
          variants: Json
        }
        Insert: {
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string
          handle: string
          id: string
          image?: string | null
          image_alt?: string | null
          images?: Json
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image?: string | null
          options?: Json
          price?: number
          price_range?: string | null
          rating?: number | null
          status?: string
          stock?: number
          updated_at?: string
          variants?: Json
        }
        Update: {
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string
          description?: string
          handle?: string
          id?: string
          image?: string | null
          image_alt?: string | null
          images?: Json
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image?: string | null
          options?: Json
          price?: number
          price_range?: string | null
          rating?: number | null
          status?: string
          stock?: number
          updated_at?: string
          variants?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
