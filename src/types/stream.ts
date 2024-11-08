// src/types/stream.ts
export interface StreamQuality {
    quality: '480p' | '720p' | '1080p' | '4K'
    url: string
  }
  
  export interface MovieStream {
    id: string
    movieId: number
    streamUrl: string
    qualities: StreamQuality[]
    format: 'HLS' | 'MP4'
    isActive: boolean
    createdAt: string
  }
  
  export interface PlayerState {
    isPlaying: boolean
    currentTime: number
    duration: number
    buffered: number
    quality: StreamQuality['quality']
    error: string | null
  }