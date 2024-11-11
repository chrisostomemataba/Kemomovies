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
  Activity
} from 'lucide-react';

// Sample data - in a real app this would come from your auth context
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

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-kemo-black text-white">
      {/* Header Section */}
      <div className="relative h-64 bg-gradient-to-b from-brand-darker to-kemo-black">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 pt-20">
          <div className="relative flex items-end space-x-6 pb-8">
            <div className="relative">
              <img
                src={sampleUser.avatar}
                alt={sampleUser.name}
                className="w-32 h-32 rounded-full border-4 border-brand-gold"
              />
              <button className="absolute bottom-2 right-2 p-2 rounded-full bg-brand-gold text-black hover:bg-brand-darker transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{sampleUser.name}</h1>
              <p className="text-brand-gold">@{sampleUser.username}</p>
            </div>
            <button className="px-4 py-2 bg-brand-gold text-black rounded-lg hover:bg-brand-darker transition-all duration-300 flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-kemo-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Account Info</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-white/80">
                  <Mail className="w-5 h-5 text-brand-gold" />
                  <span>{sampleUser.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <Calendar className="w-5 h-5 text-brand-gold" />
                  <span>Joined {new Date(sampleUser.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-kemo-gray-800 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold border-b border-white/10 pb-2">Watch Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-kemo-gray-900 rounded-lg">
                  <Film className="w-6 h-6 mx-auto mb-2 text-brand-gold" />
                  <div className="text-2xl font-bold">{sampleUser.watchedMovies}</div>
                  <div className="text-sm text-white/60">Watched</div>
                </div>
                <div className="text-center p-4 bg-kemo-gray-900 rounded-lg">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-brand-gold" />
                  <div className="text-2xl font-bold">{sampleUser.watchlist}</div>
                  <div className="text-sm text-white/60">Watchlist</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-kemo-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <button className="text-brand-gold hover:text-brand-lighter transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {sampleUser.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-kemo-gray-900 rounded-lg hover:bg-kemo-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="p-2 bg-brand-gold rounded-full">
                      <Activity className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.type === 'watch' && 'Watched'}
                        {activity.type === 'rate' && 'Rated'}
                        {activity.type === 'watchlist' && 'Added to watchlist'}
                        {' '}
                        <span className="text-brand-gold">{activity.movie}</span>
                      </p>
                      <p className="text-sm text-white/60">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Genres */}
            <div className="bg-kemo-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Favorite Genres</h2>
              <div className="flex flex-wrap gap-2">
                {sampleUser.favoriteGenres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-brand-gold text-black rounded-full font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}