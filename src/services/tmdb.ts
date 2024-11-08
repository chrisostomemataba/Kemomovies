// src/services/tmdb.ts
import axios from 'axios';
import type { 
  Movie, 
  MovieDetails, 
  MovieCredits, 
  Video, 
  Genre 
} from '../types/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

interface TMDBResponse<T> {
  page?: number;
  results: T[];
  total_pages?: number;
  total_results?: number;
}

class TMDBService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      params: {
        api_key: TMDB_API_KEY,
      },
    });
  }

  getImageUrl(path: string | null, size: string = 'original'): string {
    if (!path) return '/placeholder-image.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  async getTrendingMovies(): Promise<Movie[]> {
    const { data } = await this.client.get<TMDBResponse<Movie>>('/trending/movie/week');
    return data.results;
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const { data } = await this.client.get<MovieDetails>(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits,similar,recommendations'
      }
    });
    return data;
  }

  async getMovieCredits(id: number): Promise<MovieCredits> {
    const { data } = await this.client.get<MovieCredits>(`/movie/${id}/credits`);
    return data;
  }

  async getMovieVideos(id: number): Promise<Video[]> {
    const { data } = await this.client.get<TMDBResponse<Video>>(`/movie/${id}/videos`);
    return data.results;
  }

  async getSimilarMovies(id: number): Promise<Movie[]> {
    const { data } = await this.client.get<TMDBResponse<Movie>>(`/movie/${id}/similar`);
    return data.results;
  }

  async getGenres(): Promise<Genre[]> {
    const { data } = await this.client.get<{ genres: Genre[] }>('/genre/movie/list');
    return data.genres;
  }

  async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    const { data } = await this.client.get<TMDBResponse<Movie>>('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc'
      }
    });
    return data.results;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const { data } = await this.client.get<TMDBResponse<Movie>>('/search/movie', {
      params: { query }
    });
    return data.results;
  }

  async getUpcomingMovies(): Promise<Movie[]> {
    const { data } = await this.client.get<TMDBResponse<Movie>>('/movie/upcoming');
    return data.results;
  }

  async getTopRatedMovies(): Promise<Movie[]> {
    const { data } = await this.client.get<TMDBResponse<Movie>>('/movie/top_rated');
    return data.results;
  }
}

export const tmdbService = new TMDBService();