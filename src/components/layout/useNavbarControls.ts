// src/hooks/useNavbarControls.ts
import { useState, useEffect, useRef } from 'react';
import type { Movie } from '../../types/movie';

interface NavbarControls {
  isScrolled: boolean;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchResults: Movie[];
  isSearching: boolean;
  handleSearch: (query: string) => void;
  searchRef: React.RefObject<HTMLDivElement>;
  profileRef: React.RefObject<HTMLDivElement>;
}

export function useNavbarControls(): NavbarControls {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.results.slice(0, 6));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isScrolled,
    showProfileMenu,
    setShowProfileMenu,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    showSearch,
    setShowSearch,
    searchResults,
    isSearching,
    handleSearch,
    searchRef,
    profileRef
  };
}