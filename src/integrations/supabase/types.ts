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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          notes: string | null
          reminder_days_before: number | null
          title: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          notes?: string | null
          reminder_days_before?: number | null
          title: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          notes?: string | null
          reminder_days_before?: number | null
          title?: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_records: {
        Row: {
          cost: number
          created_at: string | null
          fuel_date: string
          fuel_type: string
          id: string
          is_full_tank: boolean | null
          location: string | null
          notes: string | null
          odometer: number
          price_per_unit: number
          quantity: number
          station_name: string | null
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          fuel_date?: string
          fuel_type: string
          id?: string
          is_full_tank?: boolean | null
          location?: string | null
          notes?: string | null
          odometer: number
          price_per_unit: number
          quantity: number
          station_name?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          fuel_date?: string
          fuel_type?: string
          id?: string
          is_full_tank?: boolean | null
          location?: string | null
          notes?: string | null
          odometer?: number
          price_per_unit?: number
          quantity?: number
          station_name?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          cost: number | null
          created_at: string | null
          description: string
          id: string
          next_service_date: string | null
          next_service_km: number | null
          notes: string | null
          odometer: number
          receipt_url: string | null
          service_date: string
          service_provider: string | null
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          description: string
          id?: string
          next_service_date?: string | null
          next_service_km?: number | null
          notes?: string | null
          odometer: number
          receipt_url?: string | null
          service_date?: string
          service_provider?: string | null
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          description?: string
          id?: string
          next_service_date?: string | null
          next_service_km?: number | null
          notes?: string | null
          odometer?: number
          receipt_url?: string | null
          service_date?: string
          service_provider?: string | null
          type?: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          avatar_url: string | null
          battery_capacity: number | null
          brand: string
          created_at: string | null
          current_km: number | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          is_primary: boolean | null
          model: string
          notes: string | null
          plate: string
          purchase_date: string | null
          tank_capacity: number | null
          type: Database["public"]["Enums"]["vehicle_type"]
          updated_at: string | null
          user_id: string
          vin: string | null
          year: number
        }
        Insert: {
          avatar_url?: string | null
          battery_capacity?: number | null
          brand: string
          created_at?: string | null
          current_km?: number | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_primary?: boolean | null
          model: string
          notes?: string | null
          plate: string
          purchase_date?: string | null
          tank_capacity?: number | null
          type?: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string | null
          user_id: string
          vin?: string | null
          year: number
        }
        Update: {
          avatar_url?: string | null
          battery_capacity?: number | null
          brand?: string
          created_at?: string | null
          current_km?: number | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_primary?: boolean | null
          model?: string
          notes?: string | null
          plate?: string
          purchase_date?: string | null
          tank_capacity?: number | null
          type?: Database["public"]["Enums"]["vehicle_type"]
          updated_at?: string | null
          user_id?: string
          vin?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      document_type:
        | "insurance"
        | "registration"
        | "inspection"
        | "invoice"
        | "warranty"
        | "other"
      fuel_type: "gasoline" | "diesel" | "electric" | "hybrid" | "lpg"
      maintenance_type:
        | "oil_change"
        | "tire_rotation"
        | "brake_service"
        | "inspection"
        | "repair"
        | "battery_replacement"
        | "other"
      vehicle_type: "car" | "motorcycle" | "electric"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: [
        "insurance",
        "registration",
        "inspection",
        "invoice",
        "warranty",
        "other",
      ],
      fuel_type: ["gasoline", "diesel", "electric", "hybrid", "lpg"],
      maintenance_type: [
        "oil_change",
        "tire_rotation",
        "brake_service",
        "inspection",
        "repair",
        "battery_replacement",
        "other",
      ],
      vehicle_type: ["car", "motorcycle", "electric"],
    },
  },
} as const
