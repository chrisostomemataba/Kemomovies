// src/hooks/useMovies.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface UseMoviesReturn {
  trendingMovies: Movie[];
  isLoading: boolean;
  error: Error | null;
}

export function useMovies(): UseMoviesReturn {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
        );
        setTrendingMovies(response.data.results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch movies'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  return { trendingMovies, isLoading, error };
}