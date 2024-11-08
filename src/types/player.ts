// src/types/player.ts
export type QualityOption = '480p' | '720p' | '1080p' | '4K';
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export interface Subtitle {
  id: string;
  language: string;
  label: string;
  url: string;
}
export interface PlayerError {
    code: string;
    message: string;
    details?: unknown;
  }

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  quality: QualityOption;
  volume: number;
  isMuted: boolean;
  playbackSpeed: PlaybackSpeed;
  isFullscreen: boolean;
  selectedSubtitle: string | null;
  error: PlayerError | null;
  loading: boolean;
}

export interface PlayerError {
  code: string;
  message: string;
  details?: unknown;
}

export interface StreamSource {
  id: string;
  quality: QualityOption;
  url: string;
  type: 'hls' | 'mp4';
  size?: number;
}

export interface WatchProgress {
  movieId: number;
  timestamp: number;
  duration: number;
  completed: boolean;
}

export interface PlayerAnalytics {
  movieId: number;
  userId: string;
  watchDuration: number;
  averagePlaybackSpeed: number;
  qualityChanges: number;
  bufferingEvents: number;
  startTime: Date;
  endTime: Date;
}