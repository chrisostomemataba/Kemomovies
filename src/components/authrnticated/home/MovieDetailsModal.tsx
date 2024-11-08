// src/components/authenticated/home/MovieDetailsModal.tsx
import { Dialog } from '@headlessui/react';
import { X, Play, Plus, ThumbsUp } from 'lucide-react';
import { Movie } from '../../../services/tmdb';
import { tmdbService } from '../../../services/tmdb';

interface MovieDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  onPlayMovie: (movieId: number) => void;
}

export function MovieDetailsModal({
  isOpen,
  onClose,
  movie,
  onPlayMovie
}: MovieDetailsModalProps) {
  if (!movie) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-xl 
            bg-kemo-gray-900 shadow-2xl overflow-hidden">
            {/* Movie Backdrop */}
            <div className="relative h-[400px]">
              <img
                src={tmdbService.getImageUrl(movie.backdrop_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t 
                from-kemo-gray-900 via-transparent to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full
                  bg-black/40 hover:bg-black/60
                  transition-colors duration-200"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                {movie.title}
              </h2>

              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => onPlayMovie(movie.id)}
                  className="px-8 py-3 bg-brand-gold hover:bg-brand-darker
                    text-kemo-black font-medium rounded-lg
                    flex items-center space-x-2
                    transform hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Now</span>
                </button>

                <button className="p-3 bg-white/10 hover:bg-white/20
                  rounded-lg transition-colors duration-300
                  group">
                  <Plus className="w-5 h-5 text-white 
                    group-hover:text-brand-gold" />
                </button>

                <button className="p-3 bg-white/10 hover:bg-white/20
                  rounded-lg transition-colors duration-300
                  group">
                  <ThumbsUp className="w-5 h-5 text-white 
                    group-hover:text-brand-gold" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                  <p className="text-white/80 leading-relaxed mb-6">
                    {movie.overview}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-white/60 block">Release Date</span>
                    <span className="text-white">
                      {new Date(movie.release_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60 block">Rating</span>
                    <span className="text-white">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}