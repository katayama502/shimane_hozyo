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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      areas: {
        Row: {
          created_at: string
          id: string
          level: Database["public"]["Enums"]["area_level"]
          name: string
          region: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          level: Database["public"]["Enums"]["area_level"]
          name: string
          region?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["area_level"]
          name?: string
          region?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          detail: Json | null
          id: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      change_logs: {
        Row: {
          change_source: string
          changed_by: string
          created_at: string
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          subsidy_id: string
        }
        Insert: {
          change_source?: string
          changed_by?: string
          created_at?: string
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          subsidy_id: string
        }
        Update: {
          change_source?: string
          changed_by?: string
          created_at?: string
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          subsidy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_logs_subsidy_id_fkey"
            columns: ["subsidy_id"]
            isOneToOne: false
            referencedRelation: "subsidies"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_runs: {
        Row: {
          created_count: number
          error_count: number
          error_message: string | null
          fetched_count: number
          finished_at: string | null
          id: string
          run_status: string
          source_name: string
          started_at: string
          updated_count: number
        }
        Insert: {
          created_count?: number
          error_count?: number
          error_message?: string | null
          fetched_count?: number
          finished_at?: string | null
          id?: string
          run_status?: string
          source_name: string
          started_at?: string
          updated_count?: number
        }
        Update: {
          created_count?: number
          error_count?: number
          error_message?: string | null
          fetched_count?: number
          finished_at?: string | null
          id?: string
          run_status?: string
          source_name?: string
          started_at?: string
          updated_count?: number
        }
        Relationships: []
      }
      organizations: {
        Row: {
          contact_text: string | null
          created_at: string
          id: string
          name: string
          org_type: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          contact_text?: string | null
          created_at?: string
          id?: string
          name: string
          org_type?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          contact_text?: string | null
          created_at?: string
          id?: string
          name?: string
          org_type?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      sources: {
        Row: {
          content_hash: string | null
          created_at: string
          fetched_at: string
          http_status: number | null
          id: string
          is_official: boolean
          subsidy_id: string
          url: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          fetched_at?: string
          http_status?: number | null
          id?: string
          is_official?: boolean
          subsidy_id: string
          url: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          fetched_at?: string
          http_status?: number | null
          id?: string
          is_official?: boolean
          subsidy_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "sources_subsidy_id_fkey"
            columns: ["subsidy_id"]
            isOneToOne: false
            referencedRelation: "subsidies"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidies: {
        Row: {
          applicant_types: string[]
          application_end_at: string | null
          application_process: string | null
          application_start_at: string | null
          contact_text: string | null
          content_hash: string | null
          created_at: string
          data_health: Database["public"]["Enums"]["data_health"]
          eligible_business_text: string | null
          eligible_expenses: string[]
          employee_max: number | null
          employee_min: number | null
          exclusion_notes: string | null
          external_id: string | null
          guideline_url: string | null
          id: string
          is_rolling: boolean
          max_amount_yen: number | null
          min_amount_yen: number | null
          official_url: string
          organization_id: string | null
          published_at: string | null
          required_documents: string | null
          search_vector: unknown
          slug: string
          status: Database["public"]["Enums"]["subsidy_status"]
          subsidy_rate_text: string | null
          summary: string
          title: string
          updated_at: string
          verified_at: string
        }
        Insert: {
          applicant_types?: string[]
          application_end_at?: string | null
          application_process?: string | null
          application_start_at?: string | null
          contact_text?: string | null
          content_hash?: string | null
          created_at?: string
          data_health?: Database["public"]["Enums"]["data_health"]
          eligible_business_text?: string | null
          eligible_expenses?: string[]
          employee_max?: number | null
          employee_min?: number | null
          exclusion_notes?: string | null
          external_id?: string | null
          guideline_url?: string | null
          id?: string
          is_rolling?: boolean
          max_amount_yen?: number | null
          min_amount_yen?: number | null
          official_url: string
          organization_id?: string | null
          published_at?: string | null
          required_documents?: string | null
          search_vector?: unknown
          slug: string
          status?: Database["public"]["Enums"]["subsidy_status"]
          subsidy_rate_text?: string | null
          summary: string
          title: string
          updated_at?: string
          verified_at?: string
        }
        Update: {
          applicant_types?: string[]
          application_end_at?: string | null
          application_process?: string | null
          application_start_at?: string | null
          contact_text?: string | null
          content_hash?: string | null
          created_at?: string
          data_health?: Database["public"]["Enums"]["data_health"]
          eligible_business_text?: string | null
          eligible_expenses?: string[]
          employee_max?: number | null
          employee_min?: number | null
          exclusion_notes?: string | null
          external_id?: string | null
          guideline_url?: string | null
          id?: string
          is_rolling?: boolean
          max_amount_yen?: number | null
          min_amount_yen?: number | null
          official_url?: string
          organization_id?: string | null
          published_at?: string | null
          required_documents?: string | null
          search_vector?: unknown
          slug?: string
          status?: Database["public"]["Enums"]["subsidy_status"]
          subsidy_rate_text?: string | null
          summary?: string
          title?: string
          updated_at?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subsidies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidy_areas: {
        Row: {
          area_id: string
          subsidy_id: string
        }
        Insert: {
          area_id: string
          subsidy_id: string
        }
        Update: {
          area_id?: string
          subsidy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subsidy_areas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subsidy_areas_subsidy_id_fkey"
            columns: ["subsidy_id"]
            isOneToOne: false
            referencedRelation: "subsidies"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidy_tags: {
        Row: {
          subsidy_id: string
          tag_id: string
        }
        Insert: {
          subsidy_id: string
          tag_id: string
        }
        Update: {
          subsidy_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subsidy_tags_subsidy_id_fkey"
            columns: ["subsidy_id"]
            isOneToOne: false
            referencedRelation: "subsidies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subsidy_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: Database["public"]["Enums"]["tag_category"]
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          category: Database["public"]["Enums"]["tag_category"]
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["tag_category"]
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      area_subsidy_counts: {
        Row: {
          area_slug: string | null
          subsidy_count: number | null
        }
        Relationships: []
      }
      tag_subsidy_counts: {
        Row: {
          category: Database["public"]["Enums"]["tag_category"] | null
          subsidy_count: number | null
          tag_slug: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_bootstrap_available: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      search_subsidies: {
        Args: {
          p_amount_max?: number
          p_amount_min?: number
          p_applicant_type?: string
          p_area_slug?: string
          p_deadline_within_days?: number
          p_industry_slugs?: string[]
          p_limit?: number
          p_offset?: number
          p_purpose_slugs?: string[]
          p_query?: string
          p_sort?: string
          p_status?: string
        }
        Returns: {
          applicant_types: string[]
          application_end_at: string
          application_start_at: string
          area_names: string[]
          data_health: Database["public"]["Enums"]["data_health"]
          id: string
          industry_tags: string[]
          is_rolling: boolean
          max_amount_yen: number
          min_amount_yen: number
          official_url: string
          organization_name: string
          purpose_tags: string[]
          slug: string
          status: string
          subsidy_rate_text: string
          summary: string
          title: string
          total_count: number
          verified_at: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      area_level: "national" | "prefecture" | "municipality"
      data_health:
        | "verified"
        | "needs_review"
        | "source_unavailable"
        | "expired"
        | "archived"
      subsidy_status:
        | "draft"
        | "scheduled"
        | "open"
        | "anytime"
        | "closed"
        | "needs_review"
        | "archived"
      tag_category: "purpose" | "industry" | "theme"
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
      area_level: ["national", "prefecture", "municipality"],
      data_health: [
        "verified",
        "needs_review",
        "source_unavailable",
        "expired",
        "archived",
      ],
      subsidy_status: [
        "draft",
        "scheduled",
        "open",
        "anytime",
        "closed",
        "needs_review",
        "archived",
      ],
      tag_category: ["purpose", "industry", "theme"],
    },
  },
} as const
