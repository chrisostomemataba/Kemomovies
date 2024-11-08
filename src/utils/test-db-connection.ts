// src/utils/test-db-connection.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://hrxfvxovojsfowuiinik.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyeGZ2eG92b2pzZm93dWlpbmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NzkyNzAsImV4cCI6MjA0NjM1NTI3MH0.DC1ShVYEg5h1TNggufRaa7i9uwOpzBJ8Ibf1p02qxT0';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

type TableName = keyof Database['public']['Tables'];

async function testConnection() {
  try {
    // Test 1: Basic Connection
    console.log('Testing Supabase Connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (connectionError) {
      throw new Error(`Connection Error: ${connectionError.message}`);
    }
    console.log('✅ Database connection successful');

    // Test 2: Auth Service
    console.log('\nTesting Auth Service...');
    const { data: authTest, error: authError } = await supabase.auth.getSession();
    if (authError) {
      throw new Error(`Auth Error: ${authError.message}`);
    }
    console.log('✅ Auth service is working');

    // Test 3: Check Tables
    console.log('\nChecking Database Tables...');
    const tables: TableName[] = [
      'profiles',
      'user_preferences',
      'watchlists',
      'watch_history',
      'movie_streams',
      'movie_subtitles',
      'player_analytics'
    ];
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Table '${table}' check failed: ${error.message}`);
        } else {
          console.log(`✅ Table '${table}' is accessible`);
        }
      } catch (error) {
        console.log(`❌ Table '${table}' check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Test 4: Specific Table Tests
    console.log('\nTesting Specific Tables...');

    // Profiles Test
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, created_at')
      .limit(1);
    console.log(profilesError 
      ? `❌ Profiles table error: ${profilesError.message}`
      : '✅ Profiles table working');

    // User Preferences Test
    const { error: preferencesError } = await supabase
      .from('user_preferences')
      .select('user_id, favorite_genres')
      .limit(1);
    console.log(preferencesError
      ? `❌ User preferences table error: ${preferencesError.message}`
      : '✅ User preferences table working');

    // Watch History Test
    const { error: historyError } = await supabase
      .from('watch_history')
      .select('user_id, movie_id')
      .limit(1);
    console.log(historyError
      ? `❌ Watch history table error: ${historyError.message}`
      : '✅ Watch history table working');

  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
  } finally {
    console.log('\nTest completed');
  }
}

// Run the test
console.log('Starting Database Connection Tests...\n');
testConnection();