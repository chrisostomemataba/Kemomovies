// src/lib/tmdb.ts
import axios from 'axios'
import { supabase } from './supabase'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const fetchMovieStream = async (movieId: number) => {
  try {
    const { data: streamData } = await supabase
      .from('movie_streams')
      .select('*')
      .eq('movie_id', movieId)
      .eq('is_active', true)
      .single()

    return streamData
  } catch (error) {
    console.error('Error fetching stream:', error)
    throw error
  }
}

export const tmdb = {
  // Movie endpoints
  getMovie: (id: number) => tmdbClient.get(`/movie/${id}`),
  getTrending: () => tmdbClient.get('/trending/movie/week'),
  searchMovies: (query: string) => tmdbClient.get('/search/movie', {
    params: { query }
  }),
  getMovieVideos: (id: number) => tmdbClient.get(`/movie/${id}/videos`),
}

export const getImageUrl = (path: string, size: string = 'original') => 
  `${TMDB_IMAGE_BASE_URL}/${size}${path}`