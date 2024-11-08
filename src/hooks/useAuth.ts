// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AuthError, 
  AuthResponse, 
  AuthTokenResponse,
  OAuthResponse,
  User,
  Session 
} from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ui/toast';
import type { Database } from '../types/supabase';
import type { Profile } from '../types/user';

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
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            session,
            user: session.user,
            profile,
            loading: false,
            error: null
          });
        } else {
          setState({
            session: null,
            user: null,
            profile: null,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Session check failed')
        }));
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            session,
            user: session.user,
            profile,
            loading: false,
            error: null
          });
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
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  };

  const signIn = async ({ email, password }: AuthCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
        variant: "default",
      });

      navigate('/home');
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Failed to sign in';
      
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async ({ email, password, username }: AuthCredentials): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
        variant: "default",
      });
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Failed to create account';
      
      toast({
        title: "Sign up failed",
        description: message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Failed to sign in with Google';
      
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear any local state/storage
      localStorage.removeItem('user-preferences');
      
      toast({
        title: "Signed out",
        description: "Successfully signed out. See you next time!",
        variant: "default",
      });

      // Navigate to landing page
      navigate('/');
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Failed to sign out';
      
      toast({
        title: "Sign out failed",
        description: message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the reset link.",
        variant: "default",
      });
    } catch (error) {
      const message = error instanceof AuthError 
        ? error.message 
        : 'Failed to send reset email';
      
      toast({
        title: "Password reset failed",
        description: message,
        variant: "destructive",
      });

      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      if (!state.user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', state.user.id);

      if (error) throw error;

      // Update local state
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : 'Failed to update profile';
      
      toast({
        title: "Profile update failed",
        description: message,
        variant: "destructive",
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
    resetPassword,
    updateProfile
  };
}