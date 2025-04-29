export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      guidance: {
        Row: {
          created_at: string
          id: string
          steps: Json[]
          summary: string | null
          task_id: string
          code_examples: Json[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          steps: Json[]
          summary?: string | null
          task_id: string
          code_examples?: Json[] | null
        }
        Update: {
          created_at?: string
          id?: string
          steps?: Json[]
          summary?: string | null
          task_id?: string
          code_examples?: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "guidance_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          idea_text: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_text: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_text?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          as_a: string
          created_at: string
          id: string
          i_want_to: string
          project_id: string
          rationale: string | null
          so_that: string
          title: string
          updated_at: string
        }
        Insert: {
          as_a: string
          created_at?: string
          id?: string
          i_want_to: string
          project_id: string
          rationale?: string | null
          so_that: string
          title: string
          updated_at?: string
        }
        Update: {
          as_a?: string
          created_at?: string
          id?: string
          i_want_to?: string
          project_id?: string
          rationale?: string | null
          so_that?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string
          id: string
          is_completed: boolean
          rationale: string | null
          story_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_completed?: boolean
          rationale?: string | null
          story_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_completed?: boolean
          rationale?: string | null
          story_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_story_id_fkey"
            columns: ["story_id"]
            referencedRelation: "stories"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
