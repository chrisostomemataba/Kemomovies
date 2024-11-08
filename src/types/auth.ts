// src/types/auth.ts
export interface AuthUser {
    id: string;
    email: string;
    username?: string;
    avatar_url?: string;
    favorite_genres?: string[];
  }
  