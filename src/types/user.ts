// src/types/user.ts
import type { Database } from './supabase';

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata?: {
    username?: string;
    avatar_url?: string;
    full_name?: string;
  };
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email: string;
  full_name?: string;
  bio?: string;
  favorite_genres?: string[];
}

export interface UserPreferences {
  user_id: string;
  favorite_genres: string[] | null;
  preferred_language: string;
  enable_notifications: boolean;
  theme: 'light' | 'dark';
  autoplay_videos: boolean;
  default_video_quality: VideoQuality;
  subtitle_language?: string;
  created_at: string;
  updated_at: string;
}

export type VideoQuality = '480p' | '720p' | '1080p' | '4K';

export interface WatchlistItem {
  id: string;
  user_id: string;
  movie_id: number;
  added_at: string;
  notes?: string;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  movie_id: number;
  watched_at: string;
  watch_duration: number | null;
  completed: boolean;
  stopped_at?: number;
}

export interface UserStats {
  total_watched: number;
  total_watchlist: number;
  favorite_genre?: string;
  watch_time: number;
  completed_movies: number;
}

// Enums for type safety
export enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

export enum NotificationType {
  NEW_CONTENT = 'new_content',
  WATCHLIST = 'watchlist',
  RECOMMENDATIONS = 'recommendations',
  SYSTEM = 'system'
}

// Helper type for form handling
export interface UpdateProfileData extends Partial<
  Omit<Profile, 'id' | 'created_at' | 'updated_at'>
> {}

// Authentication related types
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profile: Profile;
  preferences: UserPreferences;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

// Response types for API calls
export interface UserResponse {
  user: AuthUser;
  token: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  profile: Profile;
}

// Type guards
export function isAuthUser(user: any): user is AuthUser {
  return (
    user &&
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.role === 'string' &&
    user.profile &&
    user.preferences
  );
}

// Mapped types from database schema
export type DbProfile = Database['public']['Tables']['profiles']['Row'];
export type DbPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type DbWatchlist = Database['public']['Tables']['watchlists']['Row'];
export type DbWatchHistory = Database['public']['Tables']['watch_history']['Row'];

// Union type for all possible user-related errors
export type UserError =
  | { type: 'AUTH'; message: string }
  | { type: 'PROFILE'; message: string }
  | { type: 'PREFERENCES'; message: string }
  | { type: 'WATCHLIST'; message: string }
  | { type: 'HISTORY'; message: string };

// Utility type for handling async operations
export interface AsyncOperation<T> {
  data: T | null;
  loading: boolean;
  error: UserError | null;
}

// Constants
export const DEFAULT_USER_PREFERENCES: Omit<UserPreferences, 'user_id' | 'created_at' | 'updated_at'> = {
  favorite_genres: [],
  preferred_language: 'en',
  enable_notifications: true,
  theme: 'dark',
  autoplay_videos: true,
  default_video_quality: '1080p',
};

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
] as const;

export const VIDEO_QUALITIES: VideoQuality[] = ['480p', '720p', '1080p', '4K'];