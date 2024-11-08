// src/contexts/AuthContext.tsx
import { 
    createContext, 
    useContext, 
    useEffect, 
    useState,
    useCallback 
  } from 'react';
  import { Session, User } from '@supabase/supabase-js';
  import { authService, type Profile } from '../lib/auth';
  import { useNavigate } from 'react-router-dom';
  
  interface AuthState {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    isLoading: boolean;
    error: Error | null;
  }
  
  interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, username?: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
    clearError: () => void;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
      user: null,
      profile: null,
      session: null,
      isLoading: true,
      error: null
    });
    
    const navigate = useNavigate();
  
    const clearError = useCallback(() => {
      setState(prev => ({ ...prev, error: null }));
    }, []);
  
    useEffect(() => {
      let mounted = true;
  
      const initialize = async () => {
        try {
          // Get initial session
          const session = await authService.getCurrentSession();
          
          if (!mounted) return;
  
          if (session?.user) {
            const profile = await authService.getProfile(session.user.id);
            setState({
              session,
              user: session.user,
              profile,
              isLoading: false,
              error: null
            });
          } else {
            setState({
              session: null,
              user: null,
              profile: null,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          if (!mounted) return;
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Authentication failed')
          }));
        }
      };
  
      const { data: { subscription } } = authService.onAuthStateChange(
        async (session) => {
          if (!mounted) return;
  
          if (session?.user) {
            try {
              const profile = await authService.getProfile(session.user.id);
              setState({
                session,
                user: session.user,
                profile,
                isLoading: false,
                error: null
              });
              // Navigate to home page on successful auth
              navigate('/home');
            } catch (error) {
              setState(prev => ({
                ...prev,
                error: error instanceof Error ? error : new Error('Profile fetch failed')
              }));
            }
          } else {
            setState({
              session: null,
              user: null,
              profile: null,
              isLoading: false,
              error: null
            });
          }
        }
      );
  
      initialize();
  
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }, [navigate]);
  
    const signIn = async (email: string, password: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await authService.signIn(email, password);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Sign in failed')
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
  
    const signUp = async (email: string, password: string, username?: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await authService.signUp(email, password, username);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Sign up failed')
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
  
    const signInWithGoogle = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await authService.signInWithGoogle();
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Google sign in failed')
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
  
    const signOut = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await authService.signOut();
        navigate('/');
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Sign out failed')
        }));
        throw error;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
  
    const updateProfile = async (updates: Partial<Profile>) => {
      if (!state.user) throw new Error('No authenticated user');
      
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await authService.updateProfile(state.user.id, updates);
        const profile = await authService.getProfile(state.user.id);
        setState(prev => ({
          ...prev,
          profile,
          isLoading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error : new Error('Profile update failed')
        }));
        throw error;
      }
    };
  
    return (
      <AuthContext.Provider
        value={{
          ...state,
          signIn,
          signUp,
          signInWithGoogle,
          signOut,
          updateProfile,
          clearError
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }