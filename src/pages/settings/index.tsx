import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Moon,
  Sun, 
  LogOut,
  Save,
  Camera,
  Edit,
  Mail,
  Calendar,
  Film,
  Heart,
  Clock,
  ChevronRight,
  Activity,
  AlertTriangle
} from 'lucide-react';

// ... Previous code remains the same until the Action Buttons section ...
const sampleUser = {
  name: "Thomas Anderson",
  username: "neo_matrix",
  email: "neo@matrix.com",
  avatar: "/api/placeholder/150/150",
  joinDate: "2024-01-15",
  watchedMovies: 42,
  watchlist: 13,
  favoriteGenres: ["Sci-Fi", "Action", "Drama"],
  recentActivity: [
    { type: 'watch', movie: 'Inception', date: '2024-03-10' },
    { type: 'rate', movie: 'The Dark Knight', date: '2024-03-09', rating: 5 },
    { type: 'watchlist', movie: 'Dune: Part Two', date: '2024-03-08' }
  ]
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isDark, setIsDark] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-kemo-black text-white">
      {/* Previous sections remain the same ... */}
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'general'
                    ? 'bg-brand-gold text-black'
                    : 'bg-kemo-gray-800 hover:bg-kemo-gray-700'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'preferences'
                    ? 'bg-brand-gold text-black'
                    : 'bg-kemo-gray-800 hover:bg-kemo-gray-700'
                }`}
              >
                Preferences
              </button>
            </div>
          </div>

          {/* Settings Content */}
          {activeTab === 'general' ? (
            <div className="space-y-6">
              {/* Profile Settings */}
              <div className="bg-kemo-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue={sampleUser.name}
                      className="w-full px-4 py-2 bg-kemo-gray-900 rounded-lg border border-white/10 focus:border-brand-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={sampleUser.email}
                      className="w-full px-4 py-2 bg-kemo-gray-900 rounded-lg border border-white/10 focus:border-brand-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      defaultValue="********"
                      className="w-full px-4 py-2 bg-kemo-gray-900 rounded-lg border border-white/10 focus:border-brand-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-kemo-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Profile Visibility</h3>
                      <p className="text-sm text-white/60">
                        Control who can see your watch history
                      </p>
                    </div>
                    <select className="px-4 py-2 bg-kemo-gray-900 rounded-lg border border-white/10 focus:border-brand-gold focus:outline-none">
                      <option>Public</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Appearance */}
              <div className="bg-kemo-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-white/60">
                      Toggle dark mode on or off
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'bg-brand-gold text-black' : 'bg-kemo-gray-900'
                    }`}
                  >
                    {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-kemo-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-white/60">
                        Get notified about new releases
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        notifications ? 'bg-brand-gold' : 'bg-kemo-gray-900'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          notifications ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Preferences */}
              <div className="bg-kemo-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Content Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Action',
                        'Comedy',
                        'Drama',
                        'Horror',
                        'Sci-Fi',
                        'Romance'
                      ].map((genre) => (
                        <button
                          key={genre}
                          className="px-4 py-2 rounded-lg bg-kemo-gray-900 hover:bg-brand-gold hover:text-black transition-colors"
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <div className="flex space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-kemo-gray-800 hover:bg-kemo-gray-700 rounded-lg transition-colors"
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 bg-brand-gold hover:bg-brand-darker text-black rounded-lg transition-colors flex items-center space-x-2
              ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-kemo-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-2 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold">Confirm Sign Out</h2>
            </div>
            
            <p className="text-white/60 mb-6">
              Are you sure you want to sign out? You will need to sign in again to access your account.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-kemo-gray-700 hover:bg-kemo-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle logout here
                  console.log('Logging out...');
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Notification */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-4">
        {isSaving && (
          <div className="bg-brand-gold text-black px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
            <span>Saving changes...</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Add some custom animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;
document.head.appendChild(style);