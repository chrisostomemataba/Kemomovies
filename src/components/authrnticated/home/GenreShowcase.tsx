import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Film, 
  Play, 
  Plus, 
  Info,
  Clock,
  Star 
} from 'lucide-react';
import { tmdbService } from '../../../services/tmdb';
import type { Movie } from '../../../services/tmdb';

interface Genre {
  id: number;
  name: string;
}

interface MovieCardProps {
  movie: Movie;
  variant?: 'portrait' | 'landscape' | 'compact';
  onPlay?: (movieId: number) => void;
  onDetails?: (movie: Movie) => void;
}

// Movie Card Component with Multiple Variants
const MovieCard = ({ movie, variant = 'portrait', onPlay, onDetails }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const variants = {
    portrait: "w-[200px] aspect-[2/3]",
    landscape: "w-[300px] aspect-video",
    compact: "w-[160px] aspect-[2/3]"
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/movies/${movie.id}`);
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
        <img
          src={tmdbService.getImageUrl(
            variant === 'landscape' ? movie.backdrop_path : movie.poster_path
          )}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent
          transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between text-xs text-white/70 mb-3">
              <span>
                {new Date(movie.release_date).getFullYear()}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-brand-gold" />
                {movie.vote_average.toFixed(1)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePlayClick}
                className="flex-1 py-1.5 bg-brand-gold hover:bg-brand-darker
                  rounded-md text-kemo-black text-xs font-medium
                  flex items-center justify-center gap-1
                  transition-colors duration-300"
              >
                <Play className="w-3 h-3" />
                Play
              </button>
              <button
                onClick={() => onDetails?.(movie)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-md
                  transition-colors duration-300"
              >
                <Info className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Top Picks with Details Section
const TopPicksSection = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [topPicks, setTopPicks] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPicks = async () => {
      const movies = await tmdbService.getTrendingMovies();
      setTopPicks(movies.slice(0, 6));
      setSelectedMovie(movies[0]);
    };

    fetchTopPicks();
  }, []);

  if (!selectedMovie) return null;

  const handleWatchNow = () => {
    navigate(`/movies/${selectedMovie.id}`);
  };

  return (
    <div className="grid grid-cols-2 gap-8 bg-kemo-gray-900/50 
      rounded-2xl p-8 border border-white/10">
      {/* Details Side */}
      <div className="space-y-6">
        <div className="aspect-video rounded-xl overflow-hidden relative">
          <img
            src={tmdbService.getImageUrl(selectedMovie.backdrop_path)}
            alt={selectedMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t 
            from-kemo-black via-transparent to-transparent" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-display font-bold text-white">
            {selectedMovie.title}
          </h2>

          <div className="flex items-center space-x-4 text-sm">
            <span className="text-brand-gold">
              {new Date(selectedMovie.release_date).getFullYear()}
            </span>
            <div className="flex items-center text-white">
              <Star className="w-4 h-4 text-brand-gold mr-1" />
              {selectedMovie.vote_average.toFixed(1)}
            </div>
          </div>

          <p className="text-white/70 text-sm leading-relaxed">
            {selectedMovie.overview}
          </p>

          <div className="flex space-x-4">
            <button 
              onClick={handleWatchNow}
              className="px-6 py-2 bg-brand-gold hover:bg-brand-darker
                text-kemo-black font-medium rounded-lg
                flex items-center space-x-2
                transition-colors duration-300">
              <Play className="w-4 h-4" />
              <span>Watch Now</span>
            </button>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20
              text-white font-medium rounded-lg
              flex items-center space-x-2
              transition-colors duration-300">
              <Plus className="w-4 h-4" />
              <span>Add to List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Picks Grid */}
      <div>
        <h3 className="text-xl font-display font-bold text-white mb-4">
          Top Picks for You
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {topPicks.map((movie) => (
            <button
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className={`relative aspect-video rounded-lg overflow-hidden
                transition-transform duration-300 hover:scale-105
                ${selectedMovie.id === movie.id ? 'ring-2 ring-brand-gold' : ''}`}
            >
              <img
                src={tmdbService.getImageUrl(movie.backdrop_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t 
                from-black via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <h4 className="text-white text-sm font-medium truncate">
                  {movie.title}
                </h4>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Genre Showcase Component
export const GenreShowcase = () => {
  const [genreMovies, setGenreMovies] = useState<Record<number, Movie[]>>({});
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  // Fetch genres and movies
  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        // Fetch genres first
        const genreList = await tmdbService.getGenres();
        setGenres(genreList);

        // Fetch movies for each genre
        const moviesByGenre: Record<number, Movie[]> = {};
        await Promise.all(
          genreList.map(async (genre) => {
            const movies = await tmdbService.getMoviesByGenre(genre.id);
            moviesByGenre[genre.id] = movies;
          })
        );
        setGenreMovies(moviesByGenre);
      } catch (error) {
        console.error('Error fetching genre data:', error);
      }
    };

    fetchGenreData();
  }, []);

  const getLayoutForGenre = (genreId: number): 'grid' | 'horizontal' | 'compact' => {
    // Alternate layouts based on genre index
    const index = genres.findIndex(g => g.id === genreId);
    if (index % 3 === 0) return 'grid';
    if (index % 3 === 1) return 'horizontal';
    return 'compact';
  };

  const handlePlayMovie = useCallback((movieId: number) => {
    navigate(`/movies/${movieId}`);
  }, [navigate]);

  return (
    <div className="space-y-12">
      {/* Top Picks Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-white mb-8">
          Featured Picks
        </h2>
        <TopPicksSection />
      </section>

      {/* Genre Sections */}
      {genres.map((genre) => {
        const layout = getLayoutForGenre(genre.id);
        const movies = genreMovies[genre.id] || [];

        return (
          <section key={genre.id} className="relative">
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              {genre.name}
            </h2>

            {layout === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.slice(0, 10).map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    variant="portrait"
                    onPlay={handlePlayMovie}
                  />
                ))}
              </div>
            ) : layout === 'horizontal' ? (
              <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
                {movies.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    variant="landscape"
                    onPlay={handlePlayMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {movies.slice(0, 8).map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    variant="compact"
                    onPlay={handlePlayMovie}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};