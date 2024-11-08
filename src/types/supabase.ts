// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          favorite_genres: string[] | null;
          preferred_language: string;
          enable_notifications: boolean;
          theme: string;
        };
        Insert: {
          user_id: string;
          favorite_genres?: string[] | null;
          preferred_language?: string;
          enable_notifications?: boolean;
          theme?: string;
        };
        Update: {
          favorite_genres?: string[] | null;
          preferred_language?: string;
          enable_notifications?: boolean;
          theme?: string;
        };
      };
      watchlists: {
        Row: {
          id: string;
          user_id: string;
          movie_id: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: number;
          added_at?: string;
        };
        Update: {
          movie_id?: number;
          added_at?: string;
        };
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          movie_id: number;
          watched_at: string;
          watch_duration: number | null;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: number;
          watched_at?: string;
          watch_duration?: number | null;
          completed?: boolean;
        };
        Update: {
          watched_at?: string;
          watch_duration?: number | null;
          completed?: boolean;
        };
      };
      movie_streams: {
        Row: {
          id: string;
          movie_id: number;
          stream_url: string;
          quality: string;
          format: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id: number;
          stream_url: string;
          quality: string;
          format: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          stream_url?: string;
          quality?: string;
          format?: string;
          is_active?: boolean;
        };
      };
      movie_subtitles: {
        Row: {
          id: string;
          movie_id: number;
          language_code: string;
          language_label: string;
          subtitle_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id: number;
          language_code: string;
          language_label: string;
          subtitle_url: string;
          created_at?: string;
        };
        Update: {
          movie_id?: number;
          language_code?: string;
          language_label?: string;
          subtitle_url?: string;
          created_at?: string;
        };
      };
      player_analytics: {
        Row: {
          id: string;
          movie_id: number;
          user_id: string;
          watch_duration: number;
          average_playback_speed: number;
          quality_changes: number;
          buffering_events: number;
          start_time: string;
          end_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id: number;
          user_id: string;
          watch_duration: number;
          average_playback_speed: number;
          quality_changes: number;
          buffering_events: number;
          start_time: string;
          end_time: string;
          created_at?: string;
        };
        Update: {
          watch_duration?: number;
          average_playback_speed?: number;
          quality_changes?: number;
          buffering_events?: number;
          end_time?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}