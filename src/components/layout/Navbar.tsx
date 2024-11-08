// src/components/navigation/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search,
  Bell, 
  LogOut, 
  Settings,
  User as UserIcon,
  LayoutDashboard,
  ChevronDown,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useMovieSearch } from '../../hooks/useMovieSearch';
import { MovieCard } from '../shared/MovieCard';
import { useClickOutside } from '../../hooks/useClickOutside';
import type { Movie } from '../../types/movie';
import { Menu } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    results: searchResults,
    isLoading: isSearching,
    isOpen: isSearchOpen,
    setIsOpen: setSearchOpen,
    searchRef,
    searchMovies
  } = useMovieSearch();

  const profileMenuRef = useClickOutside(() => setShowProfileMenu(false));
  const searchInputRef = useClickOutside(() => setSearchOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query) {
      setSearchOpen(true);
      searchMovies(query);
    } else {
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMovieSelect = (movieId: number) => {
    setSearchOpen(false);
    navigate(`/movies/${movieId}`);
  };

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-kemo-black/95 backdrop-blur-sm shadow-lg shadow-black/20' 
        : 'bg-gradient-to-b from-kemo-black to-transparent'}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <span className="text-2xl font-playfair font-bold 
              bg-gradient-to-r from-brand-gold to-brand-lighter 
              bg-clip-text text-transparent">
              KemoMovies
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className={`text-white/70 hover:text-white transition-colors duration-300
                ${location.pathname === '/home' ? 'text-white' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`text-white/70 hover:text-white transition-colors duration-300
                ${location.pathname === '/browse' ? 'text-white' : ''}`}
            >
              Browse
            </Link>
            <Link
              to="/watchlist"
              className={`text-white/70 hover:text-white transition-colors duration-300
                ${location.pathname === '/watchlist' ? 'text-white' : ''}`}
            >
              My List
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchInputRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  onChange={handleSearchChange}
                  className="w-48 lg:w-64 px-4 py-1.5 pl-10 rounded-lg
                    bg-white/10 border border-white/10
                    focus:bg-white/20 focus:border-brand-gold/50 focus:w-72
                    text-white placeholder-white/50
                    transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                  w-4 h-4 text-white/50" />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (searchResults.length > 0 || isSearching) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-[400px] right-0
                      bg-kemo-gray-900/95 backdrop-blur-sm rounded-xl
                      border border-white/10 shadow-2xl overflow-hidden"
                  >
                    {isSearching ? (
                      <div className="p-4 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-brand-gold animate-spin" />
                      </div>
                    ) : (
                      <div className="max-h-[400px] overflow-y-auto">
                        {searchResults.map(movie => (
                          <div
                            key={movie.id}
                            onClick={() => handleMovieSelect(movie.id)}
                            className="p-2 hover:bg-white/5 cursor-pointer
                              transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div>
                                <h4 className="text-white font-medium">
                                  {movie.title}
                                </h4>
                                <p className="text-white/60 text-sm">
                                  {new Date(movie.release_date).getFullYear()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/10
              transition-colors duration-300">
              <Bell className="w-5 h-5 text-white/70" />
              <span className="absolute top-1 right-1 w-2 h-2 
                bg-brand-gold rounded-full" />
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg
                  hover:bg-white/10 transition-colors duration-300"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-gold/20
                    flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-brand-gold" />
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-300
                  ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 py-2
                      bg-kemo-gray-900/95 backdrop-blur-sm rounded-xl
                      border border-white/10 shadow-xl"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm text-white font-medium truncate">
                        {profile?.username || user?.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2
                          text-white/70 hover:text-white hover:bg-white/10
                          transition-colors duration-300"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2
                          text-white/70 hover:text-white hover:bg-white/10
                          transition-colors duration-300"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2
                          text-white/70 hover:text-white hover:bg-white/10
                          transition-colors duration-300"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="border-t border-white/10 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 w-full
                          text-white/70 hover:text-white hover:bg-white/10
                          transition-colors duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* Mobile Menu Button */}
<div className="md:hidden flex items-center">
  <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
  >
    {isMobileMenuOpen ? (
      <X className="w-6 h-6 text-white/70" />
    ) : (
      <Menu className="w-6 h-6 text-white/70" />
    )}
  </button>
</div>

{/* Mobile Menu */}
<AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 bg-kemo-gray-900/95 
        backdrop-blur-md border-t border-white/10 md:hidden"
    >
      {/* Mobile Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search movies..."
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-10 rounded-lg
              bg-white/10 border border-white/10
              focus:bg-white/20 focus:border-brand-gold/50
              text-white placeholder-white/50
              transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 
            w-5 h-5 text-white/50" />
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="px-4 pb-4 space-y-2">
        <Link
          to="/home"
          className={`block px-4 py-3 rounded-lg transition-colors duration-300
            ${location.pathname === '/home' 
              ? 'bg-brand-gold/10 text-brand-gold' 
              : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
        >
          Home
        </Link>
        <Link
          to="/browse"
          className={`block px-4 py-3 rounded-lg transition-colors duration-300
            ${location.pathname === '/browse' 
              ? 'bg-brand-gold/10 text-brand-gold' 
              : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
        >
          Browse
        </Link>
        <Link
          to="/watchlist"
          className={`block px-4 py-3 rounded-lg transition-colors duration-300
            ${location.pathname === '/watchlist' 
              ? 'bg-brand-gold/10 text-brand-gold' 
              : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
        >
          My List
        </Link>
      </div>

      {/* Mobile User Section */}
      <div className="border-t border-white/10">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white/10"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-gold/20
                flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-brand-gold" />
              </div>
            )}
            <div>
              <p className="text-white font-medium">
                {profile?.username || user?.email}
              </p>
              <p className="text-sm text-white/60">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to="/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg
                text-white/70 hover:bg-white/10 hover:text-white
                transition-colors duration-300"
            >
              <UserIcon className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg
                text-white/70 hover:bg-white/10 hover:text-white
                transition-colors duration-300"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg
                text-white/70 hover:bg-white/10 hover:text-white
                transition-colors duration-300"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                text-white/70 hover:bg-white/10 hover:text-white
                transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

{/* Mobile Search Results */}
<AnimatePresence>
  {isSearchOpen && searchResults.length > 0 && isMobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute left-0 right-0 mt-2 bg-kemo-gray-900/95 
        backdrop-blur-sm border-t border-white/10 md:hidden"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        {searchResults.map(movie => (
          <div
            key={movie.id}
            onClick={() => handleMovieSelect(movie.id)}
            className="p-4 hover:bg-white/5 cursor-pointer
              transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div>
                <h4 className="text-white font-medium">
                  {movie.title}
                </h4>
                <p className="text-white/60 text-sm">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </div>
    </nav>
  );
}