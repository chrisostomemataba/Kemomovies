// src/hooks/useMovieSearch.ts
import { useState, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { tmdbService } from '../services/tmdb';
import type { Movie } from '../types/movie';

export function useMovieSearch() {
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchMovies = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await tmdbService.searchMovies(query);
      setResults(searchResults.slice(0, 6)); // Limit to 6 results
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useDebounce(searchMovies, 300);

  return {
    results,
    isLoading,
    isOpen,
    setIsOpen,
    searchRef,
    searchMovies: debouncedSearch
  };
}