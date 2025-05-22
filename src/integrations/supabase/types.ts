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
      audit_logs: {
        Row: {
          action: string
          details: Json | null
          entity: string
          entity_id: string
          id: string
          performed_by: string
          timestamp: string
        }
        Insert: {
          action: string
          details?: Json | null
          entity: string
          entity_id: string
          id?: string
          performed_by: string
          timestamp?: string
        }
        Update: {
          action?: string
          details?: Json | null
          entity?: string
          entity_id?: string
          id?: string
          performed_by?: string
          timestamp?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: string
          approved: boolean
          approved_at: string | null
          approved_by: string | null
          asset: string
          asset_address: string | null
          blockchain_hash: string | null
          created_at: string
          created_by: string
          description: string | null
          executed: boolean
          executed_at: string | null
          id: string
          name: string
        }
        Insert: {
          amount: string
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          asset: string
          asset_address?: string | null
          blockchain_hash?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          executed?: boolean
          executed_at?: string | null
          id?: string
          name: string
        }
        Update: {
          amount?: string
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          asset?: string
          asset_address?: string | null
          blockchain_hash?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          executed?: boolean
          executed_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      campaign_products: {
        Row: {
          campaign_id: string
          color: string
          created_at: string
          description: string | null
          id: string
          material: string
          price: number
          size: number
          title: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          color: string
          created_at?: string
          description?: string | null
          id?: string
          material: string
          price: number
          size: number
          title: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          material?: string
          price?: number
          size?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_products_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          edit_window_expires_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          edit_window_expires_at: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          edit_window_expires_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_guidelines: {
        Row: {
          category: string
          created_at: string
          description: string
          examples: string[] | null
          id: string
          severity_level: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          examples?: string[] | null
          id?: string
          severity_level: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          examples?: string[] | null
          id?: string
          severity_level?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      conflict_resolutions: {
        Row: {
          common_ground: Json | null
          consensus_reached: boolean | null
          created_at: string | null
          created_by: string | null
          description: string
          disagreement_points: Json | null
          evidence_list: Json | null
          id: string
          is_public: boolean | null
          mediation_request: Json | null
          party_a: string
          party_b: string
          position_a: Json
          position_b: Json
          progress: Json
          proposed_solutions: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          common_ground?: Json | null
          consensus_reached?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description: string
          disagreement_points?: Json | null
          evidence_list?: Json | null
          id?: string
          is_public?: boolean | null
          mediation_request?: Json | null
          party_a: string
          party_b: string
          position_a: Json
          position_b: Json
          progress: Json
          proposed_solutions?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          common_ground?: Json | null
          consensus_reached?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          disagreement_points?: Json | null
          evidence_list?: Json | null
          id?: string
          is_public?: boolean | null
          mediation_request?: Json | null
          party_a?: string
          party_b?: string
          position_a?: Json
          position_b?: Json
          progress?: Json
          proposed_solutions?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_decisions: {
        Row: {
          action_taken: string | null
          created_at: string
          decision: string
          id: string
          moderator_id: string
          queue_item_id: string
          rationale: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          decision: string
          id?: string
          moderator_id: string
          queue_item_id: string
          rationale?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          decision?: string
          id?: string
          moderator_id?: string
          queue_item_id?: string
          rationale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_decisions_queue_item_id_fkey"
            columns: ["queue_item_id"]
            isOneToOne: false
            referencedRelation: "moderation_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_queue: {
        Row: {
          automated_flags: Json | null
          content: string
          created_at: string
          id: string
          item_id: string
          item_type: string
          reported_at: string
          reporter_id: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity_level: string | null
          status: string
          title: string | null
          updated_at: string
          violation_categories: string[] | null
        }
        Insert: {
          automated_flags?: Json | null
          content: string
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          reported_at?: string
          reporter_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity_level?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          violation_categories?: string[] | null
        }
        Update: {
          automated_flags?: Json | null
          content?: string
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          reported_at?: string
          reporter_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity_level?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          violation_categories?: string[] | null
        }
        Relationships: []
      }
      moderator_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          is_active: boolean
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_visible: boolean | null
          likes_count: number | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          likes_count?: number | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          likes_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          join_date: string | null
          last_active: string | null
          last_username_change: string | null
          post_count: number | null
          rank: string | null
          reputation: number | null
          social_links: Json | null
          updated_at: string
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          is_verified?: boolean | null
          join_date?: string | null
          last_active?: string | null
          last_username_change?: string | null
          post_count?: number | null
          rank?: string | null
          reputation?: number | null
          social_links?: Json | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          join_date?: string | null
          last_active?: string | null
          last_username_change?: string | null
          post_count?: number | null
          rank?: string | null
          reputation?: number | null
          social_links?: Json | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      thread_comments: {
        Row: {
          content: string
          created_at: string
          depth: number
          flags_count: number | null
          id: string
          parent_id: string | null
          thread_id: string
          updated_at: string
          upvotes_count: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          depth?: number
          flags_count?: number | null
          id?: string
          parent_id?: string | null
          thread_id: string
          updated_at?: string
          upvotes_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          depth?: number
          flags_count?: number | null
          id?: string
          parent_id?: string | null
          thread_id?: string
          updated_at?: string
          upvotes_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "thread_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_flags: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          moderator_id: string | null
          reason: string
          resolved_at: string | null
          status: string
          thread_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          moderator_id?: string | null
          reason: string
          resolved_at?: string | null
          status?: string
          thread_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          moderator_id?: string | null
          reason?: string
          resolved_at?: string | null
          status?: string
          thread_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_flags_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "thread_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_flags_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_notifications: {
        Row: {
          actor_id: string
          comment_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          thread_id: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id: string
          comment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          thread_id: string
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string
          comment_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          thread_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "thread_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_notifications_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_subscriptions: {
        Row: {
          created_at: string
          id: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_subscriptions_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_upvotes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          thread_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          thread_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          thread_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thread_upvotes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "thread_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_upvotes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          category: string
          content: string
          created_at: string
          flags_count: number | null
          id: string
          is_visible: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          upvotes_count: number | null
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          flags_count?: number | null
          id?: string
          is_visible?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes_count?: number | null
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          flags_count?: number | null
          id?: string
          is_visible?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: string
          asset: string
          asset_address: string | null
          blockchain_hash: string | null
          budget_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          from_address: string
          id: string
          timestamp: string
          to_address: string
          token_id: string | null
          type: string
        }
        Insert: {
          amount: string
          asset: string
          asset_address?: string | null
          blockchain_hash?: string | null
          budget_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          from_address: string
          id?: string
          timestamp?: string
          to_address: string
          token_id?: string | null
          type: string
        }
        Update: {
          amount?: string
          asset?: string
          asset_address?: string | null
          blockchain_hash?: string | null
          budget_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          from_address?: string
          id?: string
          timestamp?: string
          to_address?: string
          token_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_budgets"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_moderator: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
