// src/components/shared/MovieCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Plus, Star } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

interface MovieCardProps {
  movie: Movie;
  variant?: 'portrait' | 'landscape' | 'compact';
}

export const MovieCard = ({ movie, variant = 'portrait' }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const variants = {
    portrait: "w-[200px] aspect-[2/3]",
    landscape: "w-[300px] aspect-video",
    compact: "w-[160px] aspect-[2/3]"
  };

  // Sample movie data for testing
  const sampleMovie: Movie = {
    id: 1,
    title: "The Batman",
    poster_path: "/3VFI3zbuNhXzx7dIbYdmvBLekyB.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    vote_average: 8.5,
    release_date: "2022-03-01",
    overview: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement."
  };

  const handlePlay = () => {
    navigate(`/movies/${movie.id || sampleMovie.id}`);
  };

  return (
    <motion.div
      className={`relative flex-shrink-0 ${variants[variant]} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {/* Image */}
        <img
          src={`https://image.tmdb.org/t/p/w500${
            variant === 'landscape' 
              ? (movie.backdrop_path || sampleMovie.backdrop_path)
              : (movie.poster_path || sampleMovie.poster_path)
          }`}
          alt={movie.title || sampleMovie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t 
          from-black via-black/50 to-transparent
          transition-all duration-300 
          ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
              {movie.title || sampleMovie.title}
            </h3>

            <div className="flex items-center justify-between text-xs text-white/70 mb-3">
              <span>
                {new Date(movie.release_date || sampleMovie.release_date)
                  .getFullYear()}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-brand-gold" />
                {(movie.vote_average || sampleMovie.vote_average).toFixed(1)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                className="flex-1 py-1.5 bg-brand-gold hover:bg-brand-darker
                  rounded-md text-kemo-black text-xs font-medium
                  flex items-center justify-center gap-1
                  transform hover:scale-105
                  transition-all duration-300"
              >
                <Play className="w-3 h-3" />
                Play
              </button>
              <button
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md
                  transform hover:scale-105
                  transition-all duration-300"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 
          bg-black/60 backdrop-blur-sm rounded-md
          text-xs font-medium text-white
          flex items-center gap-1">
          <Star className="w-3 h-3 text-brand-gold" />
          {(movie.vote_average || sampleMovie.vote_average).toFixed(1)}
        </div>
      </div>
    </motion.div>
  );
};

// Test Component to show multiple cards
export const MovieCardGrid = () => {
  // Sample movies array
  const sampleMovies = Array(10).fill(null).map((_, index) => ({
    id: index + 1,
    title: "The Batman",
    poster_path: "/3VFI3zbuNhXzx7dIbYdmvBLekyB.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    vote_average: 8.5,
    release_date: "2022-03-01",
    overview: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement."
  }));

  return (
    <div className="min-h-screen bg-kemo-black py-12">
      <div className="container mx-auto px-4">
        {/* Portrait Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            Portrait Cards
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sampleMovies.slice(0, 5).map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                variant="portrait"
              />
            ))}
          </div>
        </div>

        {/* Landscape Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            Landscape Cards
          </h2>
          <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
            {sampleMovies.slice(0, 5).map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                variant="landscape"
              />
            ))}
          </div>
        </div>

        {/* Compact Cards */}
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            Compact Cards
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {sampleMovies.slice(0, 8).map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                variant="compact"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};