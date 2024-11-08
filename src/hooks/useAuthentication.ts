// src/hooks/useAuthentication.ts
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthError, Provider } from '@supabase/supabase-js'

interface UseAuthenticationReturn {
  signUp: (email: string, password: string, username?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithProvider: (provider: Provider) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  error: AuthError | null
  loading: boolean
}

export function useAuthentication(): UseAuthenticationReturn {
  const [error, setError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState(false)

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const signInWithProvider = async (provider: Provider) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
    } catch (e) {
      setError(e as AuthError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return {
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    error,
    loading
  }
}