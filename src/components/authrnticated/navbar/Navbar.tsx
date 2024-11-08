// src/components/authenticated/navigation/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  LayoutDashboard,
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-all duration-300 
        hover:text-white relative group
        ${isActive ? 'text-white' : 'text-white/70'}`}
    >
      {children}
      {/* Animated underline */}
      <span className={`absolute inset-x-0 bottom-0 h-0.5 
        transform origin-left transition-transform duration-300
        ${isActive 
          ? 'bg-brand-gold scale-x-100' 
          : 'bg-white/20 scale-x-0 group-hover:scale-x-100'}`} 
      />
    </Link>
  );
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-kemo-black/95 backdrop-blur-md shadow-lg shadow-black/20' 
        : 'bg-gradient-to-b from-kemo-black to-transparent'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Nav Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2">
              <span className="text-2xl font-playfair font-bold 
                bg-gradient-to-r from-brand-gold to-brand-lighter 
                bg-clip-text text-transparent
                hover:from-brand-lighter hover:to-brand-gold
                transition-all duration-500">
                KemoMovies
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/browse">Browse</NavLink>
              <NavLink to="/watchlist">My List</NavLink>
            </div>
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 lg:w-64 px-4 py-1.5 pl-10 rounded-lg
                    bg-white/10 border border-white/10
                    focus:bg-white/20 focus:border-brand-gold/50 focus:w-72
                    text-white placeholder-white/50
                    transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                  w-4 h-4 text-white/50 group-focus-within:text-brand-gold
                  transition-colors duration-300" 
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/10
              transition-colors duration-300 group">
              <Bell className="w-5 h-5 text-white/70 group-hover:text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 
                bg-brand-gold rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg
                  hover:bg-white/10 transition-colors duration-300"
              >
                <img
                  src={user?.avatar_url || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-white/10"
                />
                <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-300
                  ${isProfileOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2
                  bg-kemo-gray-900/95 backdrop-blur-md rounded-xl
                  border border-white/10 shadow-xl
                  transform origin-top-right transition-all duration-300">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm text-white font-medium truncate">
                      {user?.email}
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2
                        text-white/70 hover:text-white hover:bg-white/10
                        transition-colors duration-300 group"
                    >
                      <User className="w-4 h-4 group-hover:text-brand-gold" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2
                        text-white/70 hover:text-white hover:bg-white/10
                        transition-colors duration-300 group"
                    >
                      <LayoutDashboard className="w-4 h-4 group-hover:text-brand-gold" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2
                        text-white/70 hover:text-white hover:bg-white/10
                        transition-colors duration-300 group"
                    >
                      <Settings className="w-4 h-4 group-hover:text-brand-gold" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 w-full
                        text-white/70 hover:text-white hover:bg-white/10
                        transition-colors duration-300 group"
                    >
                      <LogOut className="w-4 h-4 group-hover:text-brand-gold" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}