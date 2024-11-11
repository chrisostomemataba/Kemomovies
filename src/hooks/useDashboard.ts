// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { tmdbService } from '../services/tmdb';
import { useAuth } from './useAuth';
import { toast } from '../components/ui/toast';
import type { Movie } from '../types/movie';

interface DashboardStats {
  totalMoviesWatched: number;
  watchlistCount: number;
  favoriteGenre: string | null;
  totalWatchTime: number;
}

export function useDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMoviesWatched: 0,
    watchlistCount: 0,
    favoriteGenre: null,
    totalWatchTime: 0
  });
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch data concurrently
        const [
          watchHistoryResponse,
          watchlistResponse,
          latestMoviesData
        ] = await Promise.all([
          supabase
            .from('watch_history')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('watchlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
          tmdbService.getTrendingMovies()
            .catch(() => [] as Movie[]) // Fallback for TMDB API
        ]);

        if (!mounted) return;

        // Handle Supabase errors
        if (watchHistoryResponse.error) throw watchHistoryResponse.error;
        if (watchlistResponse.error) throw watchlistResponse.error;

        // Update stats with fallbacks
        if (mounted) {
          setStats({
            totalMoviesWatched: watchHistoryResponse.data?.length || 0,
            watchlistCount: watchlistResponse.count || 0,
            favoriteGenre: null, // We'll implement this later
            totalWatchTime: watchHistoryResponse.data?.reduce(
              (acc, curr) => acc + (curr.watch_duration || 0), 
              0
            ) || 0
          });

          // Set latest movies with fallback
          setLatestMovies(latestMoviesData.slice(0, 5));

          // Set recommended movies (using trending as fallback)
          setRecommendedMovies(latestMoviesData.slice(5, 8));
        }

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load dashboard data'));
          toast({
            title: "Error loading dashboard",
            description: "Some data might be unavailable. Please try again later.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [user]);

  return {
    stats,
    latestMovies,
    recommendedMovies,
    isLoading,
    error,
  };
}