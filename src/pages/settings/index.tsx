// src/pages/settings/index.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Save,
  Mail, 
  Lock,
  Bell,
  Palette,
  Film
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../components/ui/toast';

interface UserPreferences {
  favorite_genres: string[];
  preferred_language: string;
  enable_notifications: boolean;
  theme: string;
}

interface UserProfile {
  username: string;
  avatar_url: string | null;
  email: string;
}

export default function SettingsPage() {
  const { handleLogout, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferencesError) throw preferencesError;

      setProfile(profileData);
      setPreferences(preferencesData);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
        variant: "default",
      });

    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving settings",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-kemo-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-display font-bold text-white mb-8">
          Settings
        </h1>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-kemo-gray-900/50 rounded-xl p-6 
            border border-white/10">
            <h2 className="text-xl font-display font-bold text-white mb-6 
              flex items-center gap-2">
              <User className="w-5 h-5 text-brand-gold" />
              Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-white/40" />
                  <span className="text-white">
                    {profile?.email}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profile?.username || ''}
                  onChange={(e) => setProfile(prev => ({
                    ...prev!,
                    username: e.target.value
                  }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg
                    px-4 py-2 text-white focus:border-brand-gold/50 
                    focus:ring-1 focus:ring-brand-gold/50
                    transition-colors duration-200"
                />
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-kemo-gray-900/50 rounded-xl p-6 
            border border-white/10">
            <h2 className="text-xl font-display font-bold text-white mb-6
              flex items-center gap-2">
              <Film className="w-5 h-5 text-brand-gold" />
              Preferences
            </h2>

            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Preferred Language
                </label>
                <select
                  value={preferences?.preferred_language || 'en'}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev!,
                    preferred_language: e.target.value
                  }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg
                    px-4 py-2 text-white focus:border-brand-gold/50
                    focus:ring-1 focus:ring-brand-gold/50
                    transition-colors duration-200"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-gold" />
                  <span className="text-white">Enable Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.enable_notifications}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev!,
                      enable_notifications: e.target.checked
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer 
                    peer-checked:bg-brand-gold transition-colors duration-200" />
                </label>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-brand-gold" />
                  <span className="text-white">Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.theme === 'dark'}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev!,
                      theme: e.target.checked ? 'dark' : 'light'
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer 
                    peer-checked:bg-brand-gold transition-colors duration-200" />
                </label>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 
                bg-white/10 hover:bg-white/20 rounded-lg
                text-white transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-2 
                bg-brand-gold hover:bg-brand-darker rounded-lg
                text-kemo-black font-medium 
                transition-colors duration-200"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}