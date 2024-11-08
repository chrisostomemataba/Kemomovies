// src/components/home/ContentShowcase.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp, 
  Clock,
  Plus
} from 'lucide-react';
import { Movie } from '../../../services/tmdb';
import { tmdbService } from '../../../services/tmdb';
import { motion, AnimatePresence } from 'framer-motion';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  type?: 'large' | 'small';
  icon?: React.ReactNode;
}

const MovieRow = ({ title, movies, type = 'small', icon }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();

  const updateArrowVisibility = () => {
    if (!rowRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    
    const scrollAmount = direction === 'left' ? -rowRef.current.clientWidth : rowRef.current.clientWidth;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const element = rowRef.current;
    if (element) {
      element.addEventListener('scroll', updateArrowVisibility);
      // Initial check
      updateArrowVisibility();
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', updateArrowVisibility);
      }
    };
  }, []);

  return (
    <div className="mb-8 last:mb-0">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-brand-gold">{icon}</div>}
          <h2 className="text-2xl font-display font-bold text-white">
            {title}
          </h2>
        </div>
      </div>

      {/* Movies Row */}
      <div className="relative group">
        {/* Scroll Buttons */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-kemo-black/90
              opacity-0 group-hover:opacity-100
              flex items-center justify-center
              border border-white/10
              hover:border-brand-gold hover:bg-brand-gold/10
              transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-kemo-black/90
              opacity-0 group-hover:opacity-100
              flex items-center justify-center
              border border-white/10
              hover:border-brand-gold hover:bg-brand-gold/10
              transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Movies Container */}
        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              layoutId={`movie-${movie.id}`}
              className={`flex-none ${type === 'large' ? 'w-80' : 'w-56'}`}
            >
              <div className="group relative rounded-lg overflow-hidden
                aspect-[2/3] bg-kemo-gray-800">
                {/* Movie Poster */}
                <img
                  src={tmdbService.getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform
                    duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black
                  via-black/50 to-transparent opacity-0 group-hover:opacity-100
                  transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {/* Movie Info */}
                    <h3 className="text-white font-medium mb-2 truncate">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm
                      text-white/70 mb-3">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <div className="flex items-center">
                        <span className="text-brand-gold mr-1">★</span>
                        {movie.vote_average.toFixed(1)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        className="flex-1 py-2 bg-brand-gold hover:bg-brand-darker
                          rounded-md text-kemo-black font-medium text-sm
                          transition-colors duration-300
                          flex items-center justify-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Play
                      </button>
                      <button
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-md
                          transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Continue Watching */}
                {type === 'large' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 
                    bg-white/20">
                    <div className="h-full bg-brand-gold w-[45%]" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ContentShowcase() {
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trendingMovies = await tmdbService.getTrendingMovies();
        setTrending(trendingMovies);
        // Temporarily using trending movies for other sections
        setContinueWatching(trendingMovies.slice(0, 9));
        setTopRated(trendingMovies.slice(5, 10));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="pb-20">
      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <MovieRow
          title="Continue Watching"
          movies={continueWatching}
          type="large"
          icon={<Clock className="w-6 h-6" />}
        />
      )}

      {/* Trending Now */}
      <MovieRow
        title="Trending Now"
        movies={trending}
        icon={<TrendingUp className="w-6 h-6" />}
      />

      {/* Top Rated */}
      <MovieRow
        title="Top Rated"
        movies={topRated}
      />
    </div>
  );
}