import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AuthError, 
  User, 
  Session 
} from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui/toast';
import type { Database } from '../types/supabase';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

interface AuthCredentials {
  email: string;
  password: string;
  username?: string;
}

async function initializeUserProfile(
  userId: string,
  username?: string
): Promise<void> {
  const timestamp = new Date().toISOString();
  
  // Insert into profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      username: username || userId,
      created_at: timestamp,
      updated_at: timestamp
    });

  if (profileError) throw profileError;

  // Initialize user preferences
  const { error: prefError } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      preferred_language: 'en',
      enable_notifications: true,
      theme: 'dark',
      favorite_genres: []
    });

  if (prefError) throw prefError;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    // Initial session check
    async function checkSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user && mounted) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          setState({
            session,
            user: session.user,
            profile,
            loading: false,
            error: null
          });
        } else if (mounted) {
          setState({
            session: null,
            user: null,
            profile: null,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error : new Error('Session check failed')
          }));
        }
      }
    }

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;

            setState({
              session,
              user: session.user,
              profile,
              loading: false,
              error: null
            });
          } catch (error) {
            setState(prev => ({
              ...prev,
              error: error instanceof Error ? error : new Error('Failed to fetch profile')
            }));
          }
        } else {
          setState({
            session: null,
            user: null,
            profile: null,
            loading: false,
            error: null
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: AuthCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Successful login - the onAuthStateChange listener will update the state
      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
        variant: "default"
      });

      navigate('/home');
    } catch (error) {
      const message = error instanceof AuthError ? error.message : 'Failed to sign in';
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async ({ email, password, username }: AuthCredentials) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      // If user was created, initialize their profile
      if (data.user) {
        await initializeUserProfile(data.user.id, username);
      }

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
        variant: "default"
      });

      // Don't navigate - wait for email confirmation
    } catch (error) {
      const message = error instanceof AuthError ? error.message : 'Failed to create account';
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;

      // The redirect will happen automatically
    } catch (error) {
      const message = error instanceof AuthError ? error.message : 'Failed to sign in with Google';
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Signed out",
        description: "Successfully signed out",
        variant: "default"
      });

      navigate('/');
    } catch (error) {
      const message = error instanceof AuthError ? error.message : 'Failed to sign out';
      toast({
        title: "Sign out failed",
        description: message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the reset link",
        variant: "default"
      });
    } catch (error) {
      const message = error instanceof AuthError ? error.message : 'Failed to send reset email';
      toast({
        title: "Password reset failed",
        description: message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword
  };
}