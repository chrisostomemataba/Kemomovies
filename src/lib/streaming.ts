// src/lib/streaming.ts
import { supabase } from './supabase';
import { Database } from '../types/supabase';
import { 
  StreamSource, 
  Subtitle, 
  WatchProgress,
  PlayerAnalytics 
} from '../types/player';

type MovieStream = Database['public']['Tables']['movie_streams']['Row'];
type WatchHistory = Database['public']['Tables']['watch_history']['Row'];

export class StreamingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StreamingError';
  }
}

export class StreamingService {
  private static instance: StreamingService;
  private constructor() {}

  static getInstance(): StreamingService {
    if (!this.instance) {
      this.instance = new StreamingService();
    }
    return this.instance;
  }

  async getStreamSources(movieId: number): Promise<StreamSource[]> {
    try {
      const { data: streams, error } = await supabase
        .from('movie_streams')
        .select('*')
        .eq('movie_id', movieId)
        .eq('is_active', true);

      if (error) throw new StreamingError(
        'Failed to fetch stream sources',
        'FETCH_STREAMS_ERROR',
        error
      );

      return streams.map((stream: MovieStream) => ({
        id: stream.id,
        quality: stream.quality as StreamSource['quality'],
        url: stream.stream_url,
        type: stream.format.toLowerCase() as StreamSource['type']
      }));
    } catch (error) {
      console.error('Stream sources error:', error);
      throw error instanceof StreamingError ? error : new StreamingError(
        'Unknown streaming error',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  async getSubtitles(movieId: number): Promise<Subtitle[]> {
    try {
      const { data: subtitles, error } = await supabase
        .from('movie_subtitles')
        .select('*')
        .eq('movie_id', movieId);

      if (error) throw new StreamingError(
        'Failed to fetch subtitles',
        'FETCH_SUBTITLES_ERROR',
        error
      );

      return subtitles.map(sub => ({
        id: sub.id,
        language: sub.language_code,
        label: sub.language_label,
        url: sub.subtitle_url
      }));
    } catch (error) {
      console.error('Subtitles error:', error);
      throw error instanceof StreamingError ? error : new StreamingError(
        'Failed to load subtitles',
        'SUBTITLE_ERROR',
        error
      );
    }
  }

  async updateWatchProgress(
    userId: string,
    movieId: number,
    progress: WatchProgress
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('watch_history')
        .upsert({
          user_id: userId,
          movie_id: movieId,
          watched_at: new Date().toISOString(),
          watch_duration: progress.timestamp,
          completed: progress.completed
        }, {
          onConflict: 'user_id,movie_id'
        });

      if (error) throw new StreamingError(
        'Failed to update watch progress',
        'UPDATE_PROGRESS_ERROR',
        error
      );
    } catch (error) {
      console.error('Watch progress error:', error);
      throw error instanceof StreamingError ? error : new StreamingError(
        'Failed to save progress',
        'SAVE_PROGRESS_ERROR',
        error
      );
    }
  }

  async getWatchHistory(userId: string): Promise<WatchHistory[]> {
    try {
      const { data: history, error } = await supabase
        .from('watch_history')
        .select(`
          *,
          movies:movie_id (
            title,
            poster_path
          )
        `)
        .eq('user_id', userId)
        .order('watched_at', { ascending: false });

      if (error) throw new StreamingError(
        'Failed to fetch watch history',
        'FETCH_HISTORY_ERROR',
        error
      );

      return history;
    } catch (error) {
      console.error('Watch history error:', error);
      throw error instanceof StreamingError ? error : new StreamingError(
        'Failed to load watch history',
        'HISTORY_ERROR',
        error
      );
    }
  }

  async saveAnalytics(analytics: PlayerAnalytics): Promise<void> {
    try {
      const { error } = await supabase
        .from('player_analytics')
        .insert({
          movie_id: analytics.movieId,
          user_id: analytics.userId,
          watch_duration: analytics.watchDuration,
          average_playback_speed: analytics.averagePlaybackSpeed,
          quality_changes: analytics.qualityChanges,
          buffering_events: analytics.bufferingEvents,
          start_time: analytics.startTime.toISOString(),
          end_time: analytics.endTime.toISOString()
        });

      if (error) throw new StreamingError(
        'Failed to save analytics',
        'SAVE_ANALYTICS_ERROR',
        error
      );
    } catch (error) {
      console.error('Analytics error:', error);
      // Don't throw here to prevent disrupting the user experience
      // Just log the error
    }
  }

  async getResumePosition(userId: string, movieId: number): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('watch_history')
        .select('watch_duration')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .single();

      if (error) throw new StreamingError(
        'Failed to fetch resume position',
        'FETCH_RESUME_ERROR',
        error
      );

      return data?.watch_duration || 0;
    } catch (error) {
      console.error('Resume position error:', error);
      return 0; // Default to start if error occurs
    }
  }
}

// Export singleton instance
export const streamingService = StreamingService.getInstance();