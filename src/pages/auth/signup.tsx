// src/pages/auth/signup.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FcGoogle } from 'react-icons/fc';

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await signUp(
        formData.get('email') as string,
        formData.get('password') as string,
        formData.get('username') as string
      );
      navigate('/home');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth-gradient px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-kemo-black/80 p-8 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join KemoMovies today
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 w-full rounded-md border dark:border-gray-700 p-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border dark:border-gray-700 p-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border dark:border-gray-700 p-2"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-kemo-black text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={() => signInWithGoogle()}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5" />
          Sign up with Google
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}