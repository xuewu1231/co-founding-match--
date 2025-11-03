// Database Types - Auto-generated from Supabase Schema
// This file provides type safety for all database operations

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          title: string
          bio: string | null
          vision: string | null
          linkedin_url: string | null
          github_url: string | null
          personal_website: string | null
          profile_completion: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          title: string
          bio?: string | null
          vision?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          personal_website?: string | null
          profile_completion?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          bio?: string | null
          vision?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          personal_website?: string | null
          profile_completion?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          category: 'ability' | 'direction' | 'role'
          is_system: boolean
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          category: 'ability' | 'direction' | 'role'
          is_system?: boolean
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          category?: 'ability' | 'direction' | 'role'
          is_system?: boolean
          usage_count?: number
          created_at?: string
        }
      }
      user_tags: {
        Row: {
          id: number
          user_id: string
          tag_id: number
          tag_type: 'my_ability' | 'seeking_ability' | 'direction'
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          tag_id: number
          tag_type: 'my_ability' | 'seeking_ability' | 'direction'
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          tag_id?: number
          tag_type?: 'my_ability' | 'seeking_ability' | 'direction'
          created_at?: string
        }
      }
      interests: {
        Row: {
          id: number
          sender_id: string
          receiver_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          responded_at: string | null
        }
        Insert: {
          id?: number
          sender_id: string
          receiver_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: number
          sender_id?: string
          receiver_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          responded_at?: string | null
        }
      }
      connections: {
        Row: {
          id: number
          user_a_id: string
          user_b_id: string
          status: 'active' | 'archived'
          user_a_status: '待联系' | '已约见' | '持续交流中' | '已归档'
          user_b_status: '待联系' | '已约见' | '持续交流中' | '已归档'
          established_at: string
          feedback_sent_at: string | null
        }
        Insert: {
          id?: number
          user_a_id: string
          user_b_id: string
          status?: 'active' | 'archived'
          user_a_status?: '待联系' | '已约见' | '持续交流中' | '已归档'
          user_b_status?: '待联系' | '已约见' | '持续交流中' | '已归档'
          established_at?: string
          feedback_sent_at?: string | null
        }
        Update: {
          id?: number
          user_a_id?: string
          user_b_id?: string
          status?: 'active' | 'archived'
          user_a_status?: '待联系' | '已约见' | '持续交流中' | '已归档'
          user_b_status?: '待联系' | '已约见' | '持续交流中' | '已归档'
          established_at?: string
          feedback_sent_at?: string | null
        }
      }
    }
    Functions: {
      calculate_profile_completion: {
        Args: {
          profile_id: string
        }
        Returns: number
      }
    }
  }
}

// Helper Types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']
export type TagUpdate = Database['public']['Tables']['tags']['Update']

export type UserTag = Database['public']['Tables']['user_tags']['Row']
export type UserTagInsert = Database['public']['Tables']['user_tags']['Insert']
export type UserTagUpdate = Database['public']['Tables']['user_tags']['Update']

export type Interest = Database['public']['Tables']['interests']['Row']
export type InterestInsert = Database['public']['Tables']['interests']['Insert']
export type InterestUpdate = Database['public']['Tables']['interests']['Update']

export type Connection = Database['public']['Tables']['connections']['Row']
export type ConnectionInsert = Database['public']['Tables']['connections']['Insert']
export type ConnectionUpdate = Database['public']['Tables']['connections']['Update']

// Custom types for frontend usage
export interface UserProfile extends Profile {
  tags?: Array<Tag & { tag_type: UserTag['tag_type'] }>
}

export interface AnonymousCard {
  id: string
  title: string
  vision: string | null
  tags: Array<Pick<Tag, 'id' | 'name' | 'category'>>
  has_sent_interest: boolean
}

export interface ConnectedUser {
  id: string
  name: string
  title: string
  linkedin_url: string | null
  github_url: string | null
  personal_website: string | null
  connection_id: number
  established_at: string
  my_status: Connection['user_a_status'] | Connection['user_b_status']
  days_since_connection: number
}

// Tag category enum for easier usage
export const TAG_CATEGORIES = {
  ABILITY: 'ability' as const,
  DIRECTION: 'direction' as const,
  ROLE: 'role' as const,
} as const

export const TAG_TYPES = {
  MY_ABILITY: 'my_ability' as const,
  SEEKING_ABILITY: 'seeking_ability' as const,
  DIRECTION: 'direction' as const,
} as const

export const INTEREST_STATUS = {
  PENDING: 'pending' as const,
  ACCEPTED: 'accepted' as const,
  REJECTED: 'rejected' as const,
} as const

export const CONNECTION_STATUS = {
  ACTIVE: 'active' as const,
  ARCHIVED: 'archived' as const,
} as const