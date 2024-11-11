// src/components/auth/AuthModal.tsx
import { useState, useEffect } from 'react';
import { Mail, Lock, User, X, type LucideIcon } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../hooks/useAuth';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
  context?: string;
}

interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  autoComplete?: string;
}

const FormInput = ({ 
  type, 
  name, 
  placeholder, 
  icon: Icon, 
  required = true,
  autoComplete 
}: InputFieldProps) => (
  <div className="relative mb-6">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
      text-white/40 group-focus-within:text-brand-gold 
      transition-colors duration-200" />
    
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      className="peer w-full bg-white/10 border border-white/10 rounded-lg
        pl-10 pr-4 py-3 text-white placeholder-white/40
        focus:outline-none focus:border-brand-gold/20 focus:ring-2 
        focus:ring-brand-gold/20 transition-all duration-200
        hover:border-white/20"
    />
  </div>
);

const AuthForm = ({
  view,
  isLoading,
  error,
  onSubmit,
  context
}: {
  view: 'login' | 'signup';
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  context?: string;
}) => (
  <div className="w-full min-w-full flex-shrink-0">
    <h2 className="text-2xl font-display font-bold text-center mb-2
      bg-gradient-to-r from-brand-gold to-brand-lighter 
      bg-clip-text text-transparent">
      {view === 'login' ? 'Welcome Back' : 'Create Account'}
    </h2>
    
    <p className="text-center text-white/60 text-sm mb-8">
      {view === 'login' 
        ? `Sign in to ${context || 'continue your experience'}`
        : 'Join us to start streaming premium content'}
    </p>

    {error && (
      <div className="mb-6 p-4 rounded-lg bg-red-500/10 
        border border-red-500/20 text-red-500 text-sm">
        {error}
      </div>
    )}

    <form onSubmit={onSubmit} className="group">
      {view === 'signup' && (
        <FormInput
          type="text"
          name="username"
          placeholder="Username"
          icon={User}
          autoComplete="username"
        />
      )}
      
      <FormInput
        type="email"
        name="email"
        placeholder="Email address"
        icon={Mail}
        autoComplete={view === 'login' ? "username" : "email"}
      />
      
      <FormInput
        type="password"
        name="password"
        placeholder="Password"
        icon={Lock}
        autoComplete={view === 'login' ? "current-password" : "new-password"}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-brand-gold hover:bg-brand-darker
          text-kemo-black font-medium rounded-lg
          transform hover:scale-[1.02] active:scale-[0.98] 
          transition-all duration-200 disabled:opacity-50 
          disabled:cursor-not-allowed disabled:transform-none
          flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span>{view === 'login' ? 'Signing in...' : 'Creating account...'}</span>
          </>
        ) : (
          <span>{view === 'login' ? 'Sign In' : 'Create Account'}</span>
        )}
      </button>
    </form>
  </div>
);

export  function AuthModal({ 
  isOpen, 
  onClose, 
  initialView = 'login', 
  context 
}: AuthModalProps) {
  const [view, setView] = useState(initialView);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (view === 'login') {
        await signIn(email, password);
      } else {
        const username = formData.get('username') as string;
        await signUp(email, password, username);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social login failed');
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.modalOverlay} onClick={onClose} />

      {/* Modal */}
      <div className={styles.modalContainer}>
        <div className="relative bg-kemo-gray-900/95 backdrop-blur-xl 
          rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full
              text-white/60 hover:text-white hover:bg-white/10
              transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>

         {/* Form Content */}
<div className="p-6 sm:p-8">
  <div className="relative overflow-hidden">
    <div 
      className="flex transition-all duration-500 ease-in-out w-[200%]"
      style={{ transform: `translateX(${view === 'login' ? '0%' : '-50%'})` }}
    >
      {/* Each slide must be exactly 50% of the container width */}
      <div className="w-1/2 flex-shrink-0">
        <AuthForm
          view="login"
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
          context={context}
        />
      </div>
      <div className="w-1/2 flex-shrink-0">
        <AuthForm
          view="signup"
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
          context={context}
        />
      </div>
    </div>
  </div>
            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-kemo-gray-900 text-white/40">
                    or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={handleSocialLogin}
                className="mt-4 w-full py-3 px-4 bg-white/5 hover:bg-white/10
                  border border-white/10 rounded-lg flex items-center 
                  justify-center space-x-2 transition-all duration-200
                  hover:border-white/20"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-white">Google</span>
              </button>
            </div>

            {/* Switch View */}
            <div className="mt-6 text-center text-sm text-white/60">
              {view === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setView('signup')}
                    className="text-brand-gold hover:text-brand-lighter 
                      font-medium transition-colors duration-200"
                  >
                    Sign up for free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setView('login')}
                    className="text-brand-gold hover:text-brand-lighter 
                      font-medium transition-colors duration-200"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}