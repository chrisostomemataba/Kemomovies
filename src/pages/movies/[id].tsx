// src/pages/movies/[id].tsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  ArrowLeft,
  Star,
  Plus,
  Share2,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';
import { tmdbService } from '../../services/tmdb';
import type { MovieDetails, Cast, Video, Movie } from '../../types/movie';
import { MovieCard } from '../../components/shared/MovieCard';
import Footer from '../../components/layout/Footer';
import { Navbar } from '../../components/authrnticated/navbar/Navbar';

interface VideoPlayerProps {
  videoKey: string;
  poster: string;
  autoplay?: boolean;
}

const VideoPlayer = ({ videoKey, poster, autoplay = true }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoKey,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          mute: 1
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (event) => {
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          }
        }
      });
    };

    return () => {
      playerRef.current?.destroy();
    };
  }, [videoKey, autoplay]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden">
    
      {/* Poster image shown until video is ready */}
      {!isReady && (
        <div className="absolute inset-0">
          <img 
            src={poster} 
            alt="Video thumbnail" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* YouTube Player */}
      <div id="youtube-player" className="w-full h-full" />

      {/* Custom Controls */}
      <div className="absolute inset-x-0 bottom-0 p-6 
        bg-gradient-to-t from-black to-transparent
        opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-brand-gold hover:bg-brand-darker
              transform hover:scale-105 transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-kemo-black" />
            ) : (
              <Play className="w-6 h-6 text-kemo-black" />
            )}
          </button>

          <button
            onClick={handleMute}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30
              transform hover:scale-105 transition-all duration-300"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const CastMember = ({ cast }: { cast: Cast }) => (
  <motion.div 
    className="flex-none w-40"
    whileHover={{ scale: 1.05 }}
  >
    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3">
      <img
        src={tmdbService.getImageUrl(cast.profile_path)}
        alt={cast.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    <h4 className="text-white font-medium line-clamp-1">{cast.name}</h4>
    <p className="text-white/60 text-sm line-clamp-1">{cast.character}</p>
  </motion.div>
);

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [movieDetails, credits, videos, similar] = await Promise.all([
          tmdbService.getMovieDetails(Number(id)),
          tmdbService.getMovieCredits(Number(id)),
          tmdbService.getMovieVideos(Number(id)),
          tmdbService.getSimilarMovies(Number(id))
        ]);

        setMovie(movieDetails);
        setCast(credits.cast);
        // Find official trailer
        const officialTrailer = videos.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailer(officialTrailer || null);
        setSimilarMovies(similar);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen bg-kemo-black flex items-center justify-center">
        <div className="text-brand-gold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kemo-black">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 p-2 rounded-full
          bg-black/20 hover:bg-black/40 backdrop-blur-sm
          transform hover:scale-105
          transition-all duration-300
          text-white/80 hover:text-white"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Hero Section with Trailer */}
      <section className="relative min-h-[60vh]">
        {trailer ? (
          <VideoPlayer
            videoKey={trailer.key}
            poster={tmdbService.getImageUrl(movie.backdrop_path)}
          />
        ) : (
          <div className="relative aspect-video">
            <img
              src={tmdbService.getImageUrl(movie.backdrop_path)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t 
              from-kemo-black via-kemo-black/50 to-transparent" />
          </div>
        )}
      </section>

      {/* Movie Details */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                {movie.title}
              </h1>

              <div className="flex items-center space-x-4 text-white/80">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-brand-gold mr-1" />
                  {movie.vote_average.toFixed(1)}
                </div>
              </div>

              <p className="text-lg text-white/70 leading-relaxed">
                {movie.overview}
              </p>

              <div className="flex items-center space-x-4">
                <button className="px-8 py-3 bg-brand-gold hover:bg-brand-darker
                  text-kemo-black font-medium rounded-lg
                  flex items-center space-x-2
                  transform hover:scale-105
                  transition-all duration-300">
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                </button>

                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20
                  transform hover:scale-105
                  transition-all duration-300">
                  <Plus className="w-5 h-5 text-white" />
                </button>

                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20
                  transform hover:scale-105
                  transition-all duration-300">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Cast Section */}
            <section>
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                Cast
              </h2>
              <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide">
                {cast.map((member) => (
                  <CastMember key={member.id} cast={member} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            {/* Movie Information */}
            <div className="bg-kemo-gray-900/50 rounded-xl p-6 space-y-4
              backdrop-blur-sm border border-white/10">
              <div>
                <h3 className="text-white/60 text-sm mb-1">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 rounded-full bg-white/10 
                        text-white text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white/60 text-sm mb-1">Original Language</h3>
                <p className="text-white">
                  {new Intl.DisplayNames(['en'], { type: 'language' })
                    .of(movie.original_language)}
                </p>
              </div>

              <div>
                <h3 className="text-white/60 text-sm mb-1">Release Date</h3>
                <p className="text-white">
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Movies */}
        <section className="mt-16">
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {similarMovies.slice(0, 5).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                variant="portrait"
              />
            ))}
          </div>
        
        </section>
      </div>
    </div>
  );
}