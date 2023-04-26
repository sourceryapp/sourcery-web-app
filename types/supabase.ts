export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attachments: {
        Row: {
          created_at: string
          id: number
          label: string | null
          mime: string | null
          pages: number | null
          request_id: number | null
          size: number | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          label?: string | null
          mime?: string | null
          pages?: number | null
          request_id?: number | null
          size?: number | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          label?: string | null
          mime?: string | null
          pages?: number | null
          request_id?: number | null
          size?: number | null
          url?: string | null
          user_id?: string | null
        }
      }
      featured_images: {
        Row: {
          created_at: string
          id: number
          label: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          label?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          label?: string | null
          url?: string | null
          user_id?: string | null
        }
      }
      messages: {
        Row: {
          created_at: string
          dynamic_data: Json | null
          id: number
          sent: boolean | null
          subject: string | null
          template_name: string | null
          to_user_id: string | null
        }
        Insert: {
          created_at?: string
          dynamic_data?: Json | null
          id?: number
          sent?: boolean | null
          subject?: string | null
          template_name?: string | null
          to_user_id?: string | null
        }
        Update: {
          created_at?: string
          dynamic_data?: Json | null
          id?: number
          sent?: boolean | null
          subject?: string | null
          template_name?: string | null
          to_user_id?: string | null
        }
      }
      organization_users: {
        Row: {
          organization_id: number
          user_id: string
        }
        Insert: {
          organization_id: number
          user_id: string
        }
        Update: {
          organization_id?: number
          user_id?: string
        }
      }
      organizations: {
        Row: {
          address: string | null
          created_at: string
          featured_image_id: number | null
          id: number
          name: string | null
          owner_id: string | null
          slug: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          featured_image_id?: number | null
          id?: number
          name?: string | null
          owner_id?: string | null
          slug?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          featured_image_id?: number | null
          id?: number
          name?: string | null
          owner_id?: string | null
          slug?: string | null
        }
      }
      payment_associations: {
        Row: {
          created_at: string
          id: number
          stripe_access_token: string | null
          stripe_customer_id: string | null
          stripe_livemode: boolean | null
          stripe_publishable_key: string | null
          stripe_refresh_token: string | null
          stripe_scope: string | null
          stripe_token_type: string | null
          stripe_user_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          stripe_access_token?: string | null
          stripe_customer_id?: string | null
          stripe_livemode?: boolean | null
          stripe_publishable_key?: string | null
          stripe_refresh_token?: string | null
          stripe_scope?: string | null
          stripe_token_type?: string | null
          stripe_user_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          stripe_access_token?: string | null
          stripe_customer_id?: string | null
          stripe_livemode?: boolean | null
          stripe_publishable_key?: string | null
          stripe_refresh_token?: string | null
          stripe_scope?: string | null
          stripe_token_type?: string | null
          stripe_user_id?: string | null
          user_id?: string | null
        }
      }
      pricing_summaries: {
        Row: {
          base_fee: number | null
          id: number
          request_id: number | null
          service_fee: number | null
          total: number | null
        }
        Insert: {
          base_fee?: number | null
          id?: number
          request_id?: number | null
          service_fee?: number | null
          total?: number | null
        }
        Update: {
          base_fee?: number | null
          id?: number
          request_id?: number | null
          service_fee?: number | null
          total?: number | null
        }
      }
      reports: {
        Row: {
          created_at: string
          id: number
          request_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          request_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          request_id?: number | null
          user_id?: string | null
        }
      }
      repositories: {
        Row: {
          active: boolean | null
          address1: string | null
          address2: string | null
          city: string | null
          country_code: string | null
          created_at: string
          featured_image_id: number | null
          geography: unknown | null
          id: number
          name: string | null
          organization_id: number | null
          postal_code: string | null
          state: string | null
        }
        Insert: {
          active?: boolean | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          featured_image_id?: number | null
          geography?: unknown | null
          id?: number
          name?: string | null
          organization_id?: number | null
          postal_code?: string | null
          state?: string | null
        }
        Update: {
          active?: boolean | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          featured_image_id?: number | null
          geography?: unknown | null
          id?: number
          name?: string | null
          organization_id?: number | null
          postal_code?: string | null
          state?: string | null
        }
      }
      request_clients: {
        Row: {
          label: string | null
          name: string | null
          request_id: number
        }
        Insert: {
          label?: string | null
          name?: string | null
          request_id: number
        }
        Update: {
          label?: string | null
          name?: string | null
          request_id?: number
        }
      }
      request_comments: {
        Row: {
          content: string | null
          created_at: string
          id: number
          request_id: number | null
          user_id: string | null
          vendor: boolean | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          request_id?: number | null
          user_id?: string | null
          vendor?: boolean | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          request_id?: number | null
          user_id?: string | null
          vendor?: boolean | null
        }
      }
      request_events: {
        Row: {
          auto: boolean
          created_at: string
          description: string | null
          id: number
          request_id: number | null
          status_id: number | null
          user_id: string | null
        }
        Insert: {
          auto?: boolean
          created_at?: string
          description?: string | null
          id?: number
          request_id?: number | null
          status_id?: number | null
          user_id?: string | null
        }
        Update: {
          auto?: boolean
          created_at?: string
          description?: string | null
          id?: number
          request_id?: number | null
          status_id?: number | null
          user_id?: string | null
        }
      }
      request_vendors: {
        Row: {
          label: string | null
          request_id: number
        }
        Insert: {
          label?: string | null
          request_id: number
        }
        Update: {
          label?: string | null
          request_id?: number
        }
      }
      requests: {
        Row: {
          archive_citation: string | null
          archive_notes: string | null
          citation: string | null
          created_at: string
          id: number
          pages: number | null
          repository_id: number | null
          status_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          archive_citation?: string | null
          archive_notes?: string | null
          citation?: string | null
          created_at?: string
          id?: number
          pages?: number | null
          repository_id?: number | null
          status_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          archive_citation?: string | null
          archive_notes?: string | null
          citation?: string | null
          created_at?: string
          id?: number
          pages?: number | null
          repository_id?: number | null
          status_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
      }
      requests_prospective: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          repository_location: string | null
          repository_name: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          repository_location?: string | null
          repository_name?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          repository_location?: string | null
          repository_name?: string | null
          title?: string | null
          user_id?: string | null
        }
      }
      result: {
        Row: {
          is_password_exist: boolean | null
        }
        Insert: {
          is_password_exist?: boolean | null
        }
        Update: {
          is_password_exist?: boolean | null
        }
      }
      status: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
      }
      user: {
        Row: {
          admin: boolean
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
        }
        Insert: {
          admin?: boolean
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
        }
        Update: {
          admin?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      event_add_attachment: {
        Args: {
          request_id: number
          user_id: string
        }
        Returns: number
      }
      event_add_internal: {
        Args: {
          request_id: number
          user_id: string
          message: string
        }
        Returns: number
      }
      event_download_attachment: {
        Args: {
          request_id: number
          user_id: string
        }
        Returns: number
      }
      event_remove_attachment: {
        Args: {
          request_id: number
          user_id: string
        }
        Returns: number
      }
      event_request_edited: {
        Args: {
          request_id: number
          user_id: string
        }
        Returns: number
      }
      event_status_changed: {
        Args: {
          request_id: number
          user_id: string
        }
        Returns: number
      }
      get_average_time_for_requests: {
        Args: {
          org_id: number
        }
        Returns: {
          totalcount: number
          totaltime: number
          averagetime: number
        }[]
      }
      request_printed: {
        Args: {
          request_id: number
          user_id: string
        }
        Returns: number
      }
      sent_chat: {
        Args: {
          request_id: number
          user_id: string
        }
        Returns: number
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
