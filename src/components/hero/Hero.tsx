// src/components/hero/Hero.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { tmdbService, type Movie } from '../../services/tmdb';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import styles from './Hero.module.css';

export function Hero() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const slideInterval = useRef<number>();
  const heroRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(heroRef, { threshold: 0.5 });

  const startSlideTimer = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = window.setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % movies.length);
    }, 6000);
  }, [movies.length]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await tmdbService.getTrendingMovies();
        setMovies(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (isVisible && !isPaused && movies.length > 0) {
      startSlideTimer();
    }
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isVisible, isPaused, movies.length, startSlideTimer]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    setTimeout(() => {
      setIsPaused(false);
      startSlideTimer();
    }, 6000);
  };

  if (isLoading || !movies.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-brand-gold animate-pulse text-2xl">
          Loading amazing content...
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentSlide];

  return (
    <section ref={heroRef} className={styles.heroSection}>
      {/* Background Slides */}
      <div className={styles.backgroundWrapper}>
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`${styles.backgroundImage} ${
              index === currentSlide ? styles.active : ''
            }`}
          >
            <img
              src={tmdbService.getImageUrl(movie.backdrop_path)}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <h1 className={`${styles.title} ${styles.titleSlide}`}>
            {currentMovie.title}
          </h1>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <Calendar className="w-5 h-5" />
            <span>
              {new Date(currentMovie.release_date).getFullYear()}
            </span>
          </div>
          <div className={styles.metadataItem}>
            <Star className="w-5 h-5 text-brand-gold" />
            <span>{currentMovie.vote_average.toFixed(1)}</span>
          </div>
          {currentMovie.genres && (
            <div className={styles.metadataItem}>
              <span>{currentMovie.genres[0]?.name}</span>
            </div>
          )}
        </div>

        <p className={styles.description}>
          {currentMovie.overview}
        </p>

        <div className={styles.buttonContainer}>
          <button className={`${styles.ctaButton} ${styles.primaryCta}`}>
            <Play className="w-5 h-5" />
            <span>Watch Now</span>
          </button>

          <button className={`${styles.ctaButton} ${styles.secondaryCta}`}>
            <Info className="w-5 h-5" />
            <span>More Details</span>
          </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className={styles.indicators}>
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`${styles.indicator} ${
              index === currentSlide ? styles.indicatorActive : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && !isPaused && (
              <div className={styles.slideProgress} />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}