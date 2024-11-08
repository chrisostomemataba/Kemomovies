// src/components/header/Header.tsx
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => (
  <a
    href={href}
    className="text-kemo-gray-300 hover:text-white transition-colors duration-300
    relative group py-2"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold 
      transition-all duration-300 group-hover:w-full" />
  </a>
);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (view: 'login' | 'signup') => {
    setAuthView(view);
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`
        fixed top-0 w-full z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-kemo-black/95 backdrop-blur-sm shadow-lg shadow-black/20' 
          : 'bg-transparent'}
      `}>
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="group flex items-center space-x-2">
                <span className="text-2xl md:text-3xl font-playfair font-bold 
                  bg-gradient-to-r from-brand-gold to-brand-lighter 
                  bg-clip-text text-transparent
                  hover:from-brand-lighter hover:to-brand-gold
                  transition-all duration-500"
                >
                  KemoMovies
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="/browse">Browse</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/about">About</NavLink>
              
              <div className="flex items-center space-x-4 ml-8">
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-2 text-brand-gold hover:text-white 
                    transition-colors duration-300 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('signup')}
                  className="px-6 py-2 bg-brand-gold hover:bg-brand-darker
                    text-kemo-black font-medium rounded-lg
                    transform hover:scale-105 transition-all duration-300
                    shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/30"
                >
                  Get Started
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-kemo-gray-300 hover:text-white
                  hover:bg-kemo-gray-800/50 transition-colors duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`
          md:hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'}
        `}>
          <div className="container mx-auto px-4 pb-6 space-y-4">
            <a href="/browse" className="block py-2 text-kemo-gray-300 hover:text-white
              transition-colors duration-300">
              Browse
            </a>
            <a href="/pricing" className="block py-2 text-kemo-gray-300 hover:text-white
              transition-colors duration-300">
              Pricing
            </a>
            <a href="/about" className="block py-2 text-kemo-gray-300 hover:text-white
              transition-colors duration-300">
              About
            </a>
            <div className="pt-4 space-y-4">
              <button
                onClick={() => openAuth('login')}
                className="w-full px-4 py-2 text-brand-gold hover:text-white
                  border border-brand-gold/20 hover:border-brand-gold
                  rounded-lg transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('signup')}
                className="w-full px-4 py-2 bg-brand-gold hover:bg-brand-darker
                  text-kemo-black font-medium rounded-lg
                  transition-all duration-300
                  shadow-lg shadow-brand-gold/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView={authView}
      />
    </>
  );
}