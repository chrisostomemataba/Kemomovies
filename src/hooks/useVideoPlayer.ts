// src/hooks/useVideoPlayer.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';
import { streamingService } from '../lib/streaming';
import { useAuth } from '../hooks/useAuth';

// Types
type QualityOption = '480p' | '720p' | '1080p' | '4K';
type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

interface PlayerError {
  code: string;
  message: string;
  details?: unknown;
}

interface PlayerState {
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



interface PlayerAnalytics {
  startTime: Date;
  qualityChanges: number;
  bufferingEvents: number;
  playbackSpeedSum: number;
  playbackSpeedSamples: number;
}

interface UseVideoPlayerProps {
  movieId: number;
  onError?: (error: PlayerError) => void;
  onProgress?: (progress: number) => void;
  onQualityChange?: (quality: QualityOption) => void;
  onSubtitleChange?: (subtitleId: string | null) => void;
}

interface VideoControls {
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  seek: (time: number) => void;
  seekBy: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setQuality: (quality: QualityOption) => void;
  setSubtitle: (subtitleId: string | null) => void;
  toggleFullscreen: () => Promise<void>;
}

export const useVideoPlayer = ({
  movieId,
  onError,
  onProgress,
  onQualityChange,
  onSubtitleChange
}: UseVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { user } = useAuth();

  const initialState: PlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    quality: '720p',
    volume: 1,
    isMuted: false,
    playbackSpeed: 1,
    isFullscreen: false,
    selectedSubtitle: null,
    error: null,
    loading: true
  };

  const [state, setState] = useState<PlayerState>(initialState);

  const analyticsRef = useRef<PlayerAnalytics>({
    startTime: new Date(),
    qualityChanges: 0,
    bufferingEvents: 0,
    playbackSpeedSum: 0,
    playbackSpeedSamples: 0
  });

  const handleError = useCallback((error: PlayerError) => {
    setState(prevState => ({
      ...prevState,
      error,
      loading: false
    }));
    onError?.(error);
  }, [onError]);

  // Quality conversion utility
  const convertToQualityOption = useCallback((height: number): QualityOption => {
    if (height >= 2160) return '4K';
    if (height >= 1080) return '1080p';
    if (height >= 720) return '720p';
    return '480p';
  }, []);

  useEffect(() => {
    const initializePlayer = async (): Promise<void> => {
      try {
        const video = videoRef.current;
        if (!video) return;

        const sources = await streamingService.getStreamSources(movieId);
        const hlsSource = sources.find(s => s.type === 'hls');

        if (!hlsSource) {
          throw new Error('No HLS source found');
        }

        if (Hls.isSupported()) {
          hlsRef.current = new Hls({
            capLevelToPlayerSize: true,
            startLevel: 2,
            debug: false
          });

          hlsRef.current.loadSource(hlsSource.url);
          hlsRef.current.attachMedia(video);

          hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              handleError({
                code: 'HLS_ERROR',
                message: 'Fatal streaming error occurred',
                details: data
              });
            }
          });

          hlsRef.current.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            const level = hlsRef.current?.levels[data.level];
            if (level) {
              const newQuality = convertToQualityOption(level.height);
              setState(prevState => ({
                ...prevState,
                quality: newQuality
              }));
              analyticsRef.current.qualityChanges++;
              onQualityChange?.(newQuality);
            }
          });

          hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
            setState(prevState => ({
              ...prevState,
              loading: false
            }));
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = hlsSource.url;
          setState(prevState => ({
            ...prevState,
            loading: false
          }));
        }

        if (user) {
          const resumePosition = await streamingService.getResumePosition(user.id, movieId);
          if (resumePosition > 0) {
            video.currentTime = resumePosition;
          }
        }
      } catch (error) {
        handleError({
          code: 'PLAYER_INIT_ERROR',
          message: 'Failed to initialize player',
          details: error
        });
      }
    };

    initializePlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [movieId, user, handleError, convertToQualityOption, onQualityChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const handlers: Record<string, EventListener> = {
      timeupdate: () => {
        setState(prevState => ({
          ...prevState,
          currentTime: video.currentTime,
          duration: video.duration || prevState.duration
        }));
        onProgress?.(video.currentTime);
      },
      progress: () => {
        if (video.buffered.length > 0) {
          setState(prevState => ({
            ...prevState,
            buffered: video.buffered.end(video.buffered.length - 1)
          }));
        }
      },
      waiting: () => {
        analyticsRef.current.bufferingEvents++;
      },
      ratechange: () => {
        analyticsRef.current.playbackSpeedSum += video.playbackRate;
        analyticsRef.current.playbackSpeedSamples++;
      },
      play: () => {
        setState(prevState => ({ ...prevState, isPlaying: true }));
      },
      pause: () => {
        setState(prevState => ({ ...prevState, isPlaying: false }));
      },
      ended: () => {
        setState(prevState => ({ ...prevState, isPlaying: false }));
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, [onProgress]);

  const controls: VideoControls = {
    play: async () => {
      const video = videoRef.current;
      if (video) {
        try {
          await video.play();
        } catch (error) {
          handleError({
            code: 'PLAYBACK_ERROR',
            message: 'Failed to start playback',
            details: error
          });
        }
      }
    },

    pause: () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
      }
    },

    toggle: async () => {
      if (state.isPlaying) {
        controls.pause();
      } else {
        await controls.play();
      }
    },

    seek: (time: number) => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = Math.max(0, Math.min(time, state.duration));
      }
    },

    seekBy: (seconds: number) => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = Math.max(
          0,
          Math.min(video.currentTime + seconds, state.duration)
        );
      }
    },

    setVolume: (volume: number) => {
      const video = videoRef.current;
      if (video) {
        const normalizedVolume = Math.max(0, Math.min(volume, 1));
        video.volume = normalizedVolume;
        video.muted = normalizedVolume === 0;
        setState(prevState => ({
          ...prevState,
          volume: normalizedVolume,
          isMuted: normalizedVolume === 0
        }));
      }
    },

    toggleMute: () => {
      const video = videoRef.current;
      if (video) {
        video.muted = !video.muted;
        setState(prevState => ({
          ...prevState,
          isMuted: video.muted
        }));
      }
    },

    setPlaybackSpeed: (speed: PlaybackSpeed) => {
      const video = videoRef.current;
      if (video) {
        video.playbackRate = speed;
        setState(prevState => ({
          ...prevState,
          playbackSpeed: speed
        }));
      }
    },

    setQuality: (quality: QualityOption) => {
      if (hlsRef.current) {
        const levelIndex = hlsRef.current.levels.findIndex(
          level => convertToQualityOption(level.height) === quality
        );
        if (levelIndex !== -1) {
          hlsRef.current.currentLevel = levelIndex;
          setState(prevState => ({
            ...prevState,
            quality
          }));
          onQualityChange?.(quality);
        }
      }
    },

    setSubtitle: (subtitleId: string | null) => {
      setState(prevState => ({
        ...prevState,
        selectedSubtitle: subtitleId
      }));
      onSubtitleChange?.(subtitleId);
    },

    toggleFullscreen: async () => {
      const container = containerRef.current;
      if (!container) return;

      try {
        if (!document.fullscreenElement) {
          await container.requestFullscreen();
          setState(prevState => ({
            ...prevState,
            isFullscreen: true
          }));
        } else {
          await document.exitFullscreen();
          setState(prevState => ({
            ...prevState,
            isFullscreen: false
          }));
        }
      } catch (error) {
        console.error('Fullscreen error:', error);
      }
    }
  };

  return {
    videoRef,
    containerRef,
    state,
    controls
  };
};