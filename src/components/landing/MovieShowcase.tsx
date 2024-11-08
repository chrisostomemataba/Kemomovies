// src/components/landing/MovieShowcase.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Play, Info, TrendingUp } from 'lucide-react';
import { Movie } from '../../services/tmdb';
import { tmdbService } from '../../services/tmdb';
import { AuthModal } from '../auth/AuthModal';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  onAuthRequired: (type: 'play' | 'info') => void;
}

interface GenreSection {
  id: number;
  name: string;
  description: string;
  movies: Movie[];
  accent: string;
}

const MovieCard = ({ movie, priority = false, onAuthRequired }: MovieCardProps) => {
  const handleAction = (type: 'play' | 'info') => {
    // Trigger authentication modal with appropriate context
    onAuthRequired(type);
  };

  return (
    <div className="relative group shrink-0 w-[200px] md:w-[240px] rounded-xl overflow-hidden">
      <div className="relative aspect-[2/3] overflow-hidden bg-kemo-gray-800/50">
        {/* Shimmer Loading Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-kemo-gray-800 to-kemo-gray-700 
          animate-pulse group-hover:animate-none transition-all duration-300" />
        
        {/* Movie Poster */}
        <img
          src={tmdbService.getImageUrl(movie.poster_path)}
          alt={`${movie.title} poster`}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover transform group-hover:scale-110 
            transition-all duration-700 ease-out relative z-10"
          onClick={() => handleAction('info')}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-kemo-black via-kemo-black/80 to-transparent
          opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <div className="transform translate-y-4 group-hover:translate-y-0 
              transition-all duration-300 space-y-2">
              {/* Rating & Year */}
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-brand-gold" />
                <span className="text-sm text-white/90 font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-sm text-kemo-gray-300">
                  • {new Date(movie.release_date).getFullYear()}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
                {movie.title}
              </h3>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                <button 
                  onClick={() => handleAction('play')}
                  className="flex-1 py-1.5 px-3 bg-brand-gold rounded-md 
                    hover:bg-brand-darker text-sm font-medium text-kemo-black
                    transform hover:scale-105 transition-all duration-300
                    flex items-center justify-center space-x-1">
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </button>
                <button 
                  onClick={() => handleAction('info')}
                  className="p-1.5 bg-kemo-gray-700/80 rounded-md hover:bg-kemo-gray-700
                    transform hover:scale-105 transition-all duration-300">
                  <Info className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ScrollButton component remains the same...
const ScrollButton = ({ 
  direction, 
  onClick,
  disabled 
}: { 
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      absolute top-1/2 -translate-y-1/2 z-30
      ${direction === 'left' ? '-left-5' : '-right-5'}
      w-10 h-10 rounded-full bg-kemo-black/90 
      flex items-center justify-center
      hover:bg-brand-gold
      disabled:opacity-0 disabled:pointer-events-none
      transition-all duration-300 group
      border border-kemo-gray-700 hover:border-brand-gold
      shadow-lg shadow-black/20
    `}
  >
    {direction === 'left' ? (
      <ChevronLeft className="w-6 h-6 text-white group-hover:text-kemo-black" />
    ) : (
      <ChevronRight className="w-6 h-6 text-white group-hover:text-kemo-black" />
    )}
  </button>
);

export default function MovieShowcase() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [genreSections, setGenreSections] = useState<GenreSection[]>([]);
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalContext, setAuthModalContext] = useState<'play' | 'info'>('play');
  
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Fetch movies effect stays the same...
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trending = await tmdbService.getTrendingMovies();
        setTrendingMovies(trending);
        
        setGenreSections([
          {
            id: 1,
            name: "Action & Adventure",
            description: "Epic battles, thrilling chases, and heroic journeys",
            movies: Array(15).fill(null).map((_, i) => trending[i % trending.length]),
            accent: "from-yellow-500"
          },
          {
            id: 2,
            name: "Sci-Fi & Fantasy",
            description: "Journey beyond reality into imaginative worlds",
            movies: Array(15).fill(null).map((_, i) => trending[(i + 3) % trending.length]),
            accent: "from-blue-500"
          },
          {
            id: 3,
            name: "Drama",
            description: "Compelling stories that move and inspire",
            movies: Array(15).fill(null).map((_, i) => trending[(i + 5) % trending.length]),
            accent: "from-purple-500"
          },
          {
            id: 4,
            name: "Mystery & Thriller",
            description: "Suspense-filled tales that keep you guessing",
            movies: Array(15).fill(null).map((_, i) => trending[(i + 7) % trending.length]),
            accent: "from-red-500"
          }
        ]);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleScroll = (sectionId: string | number) => {
    const container = scrollContainerRefs.current[sectionId];
    if (container) {
      setScrollPositions(prev => ({
        ...prev,
        [sectionId]: container.scrollLeft
      }));
    }
  };

  const scroll = (sectionId: string | number, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current[sectionId];
    if (container) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAuthRequired = (type: 'play' | 'info') => {
    setAuthModalContext(type);
    setShowAuthModal(true);
  };

  return (
    <>
      <section className="py-24 bg-kemo-black overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Trending Section */}
          <div className="mb-20">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-brand-gold" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Trending Now
              </h2>
            </div>
            <p className="text-kemo-gray-300 text-lg mb-8">
              Most watched movies this week
            </p>
            
            <div className="relative group">
              <div
                ref={el => scrollContainerRefs.current['trending'] = el}
                onScroll={() => handleScroll('trending')}
                className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide 
                  scroll-smooth pb-8 -mx-6 px-6"
              >
                {trendingMovies.map((movie, index) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    priority={index < 4} 
                    onAuthRequired={handleAuthRequired}
                  />
                ))}
              </div>
              
              <ScrollButton
                direction="left"
                onClick={() => scroll('trending', 'left')}
                disabled={!scrollPositions['trending']}
              />
              <ScrollButton
                direction="right"
                onClick={() => scroll('trending', 'right')}
                disabled={
                  scrollContainerRefs.current['trending']?.scrollWidth ===
                  (scrollContainerRefs.current['trending']?.scrollLeft || 0) +
                  (scrollContainerRefs.current['trending']?.clientWidth || 0)
                }
              />
            </div>
          </div>

          {/* Genre Sections */}
          <div className="space-y-16">
            {genreSections.map(section => (
              <div key={section.id} className="relative">
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                    {section.name}
                  </h2>
                  <p className="text-kemo-gray-300 mb-8 max-w-2xl">
                    {section.description}
                  </p>
                  <div className={`absolute -left-6 -right-6 h-px bg-gradient-to-r 
                    ${section.accent} to-transparent opacity-20 bottom-0`} />
                </div>
                
                <div className="relative group">
                  <div
                    ref={el => scrollContainerRefs.current[section.id] = el}
                    onScroll={() => handleScroll(section.id)}
                    className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide 
                      scroll-smooth pb-8 -mx-6 px-6"
                  >
                    {section.movies.map(movie => (
                      <MovieCard 
                        key={movie.id} 
                        movie={movie}
                        onAuthRequired={handleAuthRequired}
                      />
                    ))}
                  </div>
                  
                  <ScrollButton
                    direction="left"
                    onClick={() => scroll(section.id, 'left')}
                    disabled={!scrollPositions[section.id]}
                  />
                  <ScrollButton
                    direction="right"
                    onClick={() => scroll(section.id, 'right')}
                    disabled={
                      scrollContainerRefs.current[section.id]?.scrollWidth ===
                      (scrollContainerRefs.current[section.id]?.scrollLeft || 0) +
                      (scrollContainerRefs.current[section.id]?.clientWidth || 0)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView="signup"
        context={authModalContext === 'play' ? 'watch movie' : 'view details'}
      />
    </>
  );
}