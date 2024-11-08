// src/lib/auth.ts
import { 
    createClient, 
    User, 
    Session, 
    AuthError, 
    AuthResponse 
  } from '@supabase/supabase-js';
  import type { Database } from '../types/supabase';
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  export type Profile = Database['public']['Tables']['profiles']['Row'];
  
  export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
  
  export class AuthService {
    async getCurrentSession(): Promise<Session | null> {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  
    async getCurrentUser(): Promise<User | null> {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  
    async signUp(email: string, password: string, username?: string): Promise<AuthResponse> {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username: username || email.split('@')[0],
            }
          }
        });
  
        if (error) throw error;
  
        if (data?.user) {
          await this.initializeProfile(data.user.id, {
            username: username || email.split('@')[0],
          });
        }
  
        return { data, error: null };
      } catch (error) {
        console.error('Sign up error:', error);
        throw error;
      }
    }
  
    private async initializeProfile(userId: string, data: { username: string }) {
      const timestamp = new Date().toISOString();
  
      try {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: data.username,
            created_at: timestamp,
            updated_at: timestamp
          });
  
        if (profileError) throw profileError;
  
        // Initialize preferences
        const { error: prefError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            favorite_genres: [],
            preferred_language: 'en',
            enable_notifications: true,
            theme: 'dark'
          });
  
        if (prefError) throw prefError;
      } catch (error) {
        console.error('Profile initialization error:', error);
        throw error;
      }
    }
  
    async signIn(email: string, password: string): Promise<AuthResponse> {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
  
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    }
  
    async signInWithGoogle(): Promise<AuthResponse> {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
  
        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
    }
  
    async signOut(): Promise<void> {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        console.error('Sign out error:', error);
        throw error;
      }
    }
  
    async getProfile(userId: string): Promise<Profile | null> {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
  
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Get profile error:', error);
        return null;
      }
    }
  
    async updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);
  
        if (error) throw error;
      } catch (error) {
        console.error('Update profile error:', error);
        throw error;
      }
    }
  
    onAuthStateChange(callback: (session: Session | null) => void) {
      return supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
      });
    }
  }
  
  export const authService = new AuthService();