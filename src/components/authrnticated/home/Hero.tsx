// src/components/authenticated/home/Hero.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Movie } from '../../../services/tmdb';
import { tmdbService } from '../../../services/tmdb';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';
import { MovieDetailsModal } from './MovieDetailsModal';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroVideoPlayerProps {
  movie: Movie;
  onStateChange: (isPlaying: boolean) => void;
}

const HeroVideoPlayer = ({ movie, onStateChange }: HeroVideoPlayerProps) => {
  const {
    videoRef,
    containerRef,
    state: playerState,
    controls
  } = useVideoPlayer({
    movieId: movie.id,
    onError: (error) => console.error('Video player error:', error),
  });

  useEffect(() => {
    onStateChange(playerState.isPlaying);
  }, [playerState.isPlaying, onStateChange]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
      />
    </div>
  );
};

export function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trendingMovies = await tmdbService.getTrendingMovies();
        setMovies(trendingMovies.slice(0, 9)); // Limit to 5 movies for better performance
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Handle movie transitions
  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      if (!isVideoPlaying) { // Only advance if video isn't playing
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [movies.length, isVideoPlaying]);

  const currentMovie = movies[currentIndex];

  const handlePlayMovie = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  if (!currentMovie) return null;

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-kemo-black">
      {/* Background Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Fallback Image */}
          <img
            src={tmdbService.getImageUrl(currentMovie.backdrop_path)}
            alt={currentMovie.title}
            className={`w-full h-full object-cover ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}
              transition-opacity duration-700`}
          />

          {/* Video Player */}
          <HeroVideoPlayer
            movie={currentMovie}
            onStateChange={setIsVideoPlaying}
          />

          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t 
            from-kemo-black via-kemo-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r 
            from-kemo-black via-kemo-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
        <motion.div
          key={`content-${currentMovie.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display 
            font-bold text-white mb-4 leading-none">
            {currentMovie.title}
          </h1>

          {/* Info Row */}
          <div className="flex items-center space-x-4 text-lg text-white/80 mb-6">
            <span className="text-brand-gold font-medium">
              {new Date(currentMovie.release_date).getFullYear()}
            </span>
            <span className="w-1 h-1 bg-white/50 rounded-full" />
            <span className="flex items-center">
              <svg className="w-5 h-5 text-brand-gold mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {currentMovie.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Overview */}
          <p className="text-lg text-white/70 mb-8 line-clamp-3">
            {currentMovie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handlePlayMovie(currentMovie.id)}
              className="px-8 py-3 bg-brand-gold hover:bg-brand-darker
                text-kemo-black font-medium rounded-lg
                flex items-center space-x-2
                transform hover:scale-105 transition-all duration-300
                shadow-lg shadow-brand-gold/20"
            >
              <Play className="w-5 h-5" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20
                text-white font-medium rounded-lg
                flex items-center space-x-2
                backdrop-blur-sm
                transform hover:scale-105 transition-all duration-300"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Movie Navigation */}
      <div className="absolute bottom-8 right-8 flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 h-2 bg-brand-gold'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/70'
              } rounded-full`}
            />
          ))}
        </div>
      </div>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        movie={currentMovie}
        onPlayMovie={handlePlayMovie}
      />
    </section>
  );
}