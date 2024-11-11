import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { toast } from '../components/ui/toast';

interface UserPreferences {
  preferred_language: string;
  enable_notifications: boolean;
  theme: string;
  favorite_genres: string[];
}

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchPreferences() {
      try {
        if (!user) {
          setPreferences(null);
          return;
        }

        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (mounted) {
          setPreferences(data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load preferences",
          variant: "destructive",
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchPreferences();

    return () => {
      mounted = false;
    };
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    try {
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, ...updates } : null);

      return true;
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update preferences",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences
  };
}