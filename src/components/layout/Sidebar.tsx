// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Heart, Clock, Settings } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Film, label: 'Movies', path: '/movies' },
    { icon: Heart, label: 'Watchlist', path: '/watchlist' },
    { icon: Clock, label: 'Continue Watching', path: '/continue' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-kemo-black border-r dark:border-gray-800">
      {/* Logo */}
      <div className="p-4 border-b dark:border-gray-800">
        <Link to="/home" className="flex items-center space-x-2">
          <span className="font-logo text-xl font-bold">
            <span className="text-brand-gold">KEMO</span>
            <span className="dark:text-white">MOVIES</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center space-x-2 px-4 py-3 text-sm
              ${isActive(path)
                ? 'text-brand-gold bg-brand-gold/10'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}