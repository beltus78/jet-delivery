export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          actual_delivery_date: string | null
          created_at: string
          current_lat: number | null
          current_lng: number | null
          current_location: string | null
          customer_id: string | null
          description: string | null
          destination_address: string
          destination_city: string
          destination_country: string
          destination_lat: number | null
          destination_lng: number | null
          destination_postal_code: string | null
          destination_state: string | null
          dimensions: Json | null
          estimated_delivery_date: string | null
          id: string
          origin_address: string
          origin_city: string
          origin_country: string
          origin_lat: number | null
          origin_lng: number | null
          origin_postal_code: string | null
          origin_state: string | null
          status: Database["public"]["Enums"]["package_status"]
          tracking_number: string
          updated_at: string
          value: number | null
          weight: number | null
        }
        Insert: {
          actual_delivery_date?: string | null
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          current_location?: string | null
          customer_id?: string | null
          description?: string | null
          destination_address: string
          destination_city: string
          destination_country: string
          destination_lat?: number | null
          destination_lng?: number | null
          destination_postal_code?: string | null
          destination_state?: string | null
          dimensions?: Json | null
          estimated_delivery_date?: string | null
          id?: string
          origin_address: string
          origin_city: string
          origin_country: string
          origin_lat?: number | null
          origin_lng?: number | null
          origin_postal_code?: string | null
          origin_state?: string | null
          status?: Database["public"]["Enums"]["package_status"]
          tracking_number: string
          updated_at?: string
          value?: number | null
          weight?: number | null
        }
        Update: {
          actual_delivery_date?: string | null
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          current_location?: string | null
          customer_id?: string | null
          description?: string | null
          destination_address?: string
          destination_city?: string
          destination_country?: string
          destination_lat?: number | null
          destination_lng?: number | null
          destination_postal_code?: string | null
          destination_state?: string | null
          dimensions?: Json | null
          estimated_delivery_date?: string | null
          id?: string
          origin_address?: string
          origin_city?: string
          origin_country?: string
          origin_lat?: number | null
          origin_lng?: number | null
          origin_postal_code?: string | null
          origin_state?: string | null
          status?: Database["public"]["Enums"]["package_status"]
          tracking_number?: string
          updated_at?: string
          value?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          created_at: string
          description: string
          event_type: Database["public"]["Enums"]["tracking_event_type"]
          id: string
          lat: number | null
          lng: number | null
          location: string | null
          package_id: string
        }
        Insert: {
          created_at?: string
          description: string
          event_type: Database["public"]["Enums"]["tracking_event_type"]
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          package_id: string
        }
        Update: {
          created_at?: string
          description?: string
          event_type?: Database["public"]["Enums"]["tracking_event_type"]
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
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
      package_status:
        | "pending"
        | "picked_up"
        | "in_transit"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "returned"
      tracking_event_type:
        | "created"
        | "picked_up"
        | "in_transit"
        | "arrived_at_facility"
        | "departed_facility"
        | "out_for_delivery"
        | "delivery_attempted"
        | "delivered"
        | "exception"
        | "cancelled"
        | "returned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      package_status: [
        "pending",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      tracking_event_type: [
        "created",
        "picked_up",
        "in_transit",
        "arrived_at_facility",
        "departed_facility",
        "out_for_delivery",
        "delivery_attempted",
        "delivered",
        "exception",
        "cancelled",
        "returned",
      ],
    },
  },
} as const
