import React from 'react';
import { 
  BarChart, 
  LineChart, 
  Line,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Film, 
  TrendingUp,
  Star,
  Calendar,
  ChevronRight,
  Play,
  Clock,
  Heart
} from 'lucide-react';

// Sample data
const SAMPLE_DATA = {
  stats: {
    watchedMovies: 42,
    watchlistCount: 15,
    totalWatchTime: 84, // in hours
    averageRating: 4.2
  },
  trendingMovies: [
    {
      id: 1,
      title: "Dune: Part Two",
      release_date: "2024-03-01",
      vote_average: 8.5,
      poster_path: "/api/placeholder/100/150",
      popularity: 350
    },
    {
      id: 2,
      title: "Oppenheimer",
      release_date: "2024-02-15",
      vote_average: 8.8,
      poster_path: "/api/placeholder/100/150",
      popularity: 320
    },
    {
      id: 3,
      title: "Poor Things",
      release_date: "2024-01-30",
      vote_average: 8.3,
      poster_path: "/api/placeholder/100/150",
      popularity: 280
    },
    {
      id: 4,
      title: "The Batman Part II",
      release_date: "2024-03-10",
      vote_average: 8.1,
      poster_path: "/api/placeholder/100/150",
      popularity: 260
    },
    {
      id: 5,
      title: "Deadpool 3",
      release_date: "2024-02-28",
      vote_average: 8.4,
      poster_path: "/api/placeholder/100/150",
      popularity: 310
    }
  ],
  watchTimeData: [
    { month: 'Jan', hours: 20 },
    { month: 'Feb', hours: 32 },
    { month: 'Mar', hours: 28 },
    { month: 'Apr', hours: 35 },
    { month: 'May', hours: 25 },
    { month: 'Jun', hours: 30 }
  ],
  genreDistribution: [
    { name: 'Action', count: 35 },
    { name: 'Drama', count: 28 },
    { name: 'Comedy', count: 22 },
    { name: 'Sci-Fi', count: 15 },
    { name: 'Horror', count: 12 }
  ]
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-kemo-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">Your movie watching overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Watched Movies */}
          <div className="bg-kemo-gray-800 rounded-xl p-6 hover:bg-kemo-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Watched Movies</p>
                <p className="text-2xl font-bold mt-1">
                  {SAMPLE_DATA.stats.watchedMovies}
                </p>
              </div>
              <div className="p-3 bg-brand-gold/10 rounded-lg">
                <Film className="w-6 h-6 text-brand-gold" />
              </div>
            </div>
          </div>

          {/* Watchlist Count */}
          <div className="bg-kemo-gray-800 rounded-xl p-6 hover:bg-kemo-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">In Watchlist</p>
                <p className="text-2xl font-bold mt-1">
                  {SAMPLE_DATA.stats.watchlistCount}
                </p>
              </div>
              <div className="p-3 bg-brand-gold/10 rounded-lg">
                <Heart className="w-6 h-6 text-brand-gold" />
              </div>
            </div>
          </div>

          {/* Watch Time */}
          <div className="bg-kemo-gray-800 rounded-xl p-6 hover:bg-kemo-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Total Watch Time</p>
                <p className="text-2xl font-bold mt-1">
                  {SAMPLE_DATA.stats.totalWatchTime}h
                </p>
              </div>
              <div className="p-3 bg-brand-gold/10 rounded-lg">
                <Clock className="w-6 h-6 text-brand-gold" />
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-kemo-gray-800 rounded-xl p-6 hover:bg-kemo-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold mt-1">
                  {SAMPLE_DATA.stats.averageRating}
                </p>
              </div>
              <div className="p-3 bg-brand-gold/10 rounded-lg">
                <Star className="w-6 h-6 text-brand-gold" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Watch Time Trend */}
          <div className="bg-kemo-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Watch Time Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SAMPLE_DATA.watchTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#E6B325" 
                    strokeWidth={2}
                    dot={{ fill: '#E6B325' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Genre Distribution */}
          <div className="bg-kemo-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Genre Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SAMPLE_DATA.genreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#E6B325" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trending Movies Table */}
        <div className="bg-kemo-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Latest Movies</h2>
            <button className="text-brand-gold hover:text-brand-darker transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 pl-4">Movie</th>
                  <th className="pb-3">Release Date</th>
                  <th className="pb-3">Rating</th>
                  <th className="pb-3">Popularity</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_DATA.trendingMovies.map((movie) => (
                  <tr 
                    key={movie.id}
                    className="border-b border-gray-700/50 hover:bg-kemo-gray-700/50 transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={movie.poster_path}
                          alt={movie.title}
                          className="w-10 h-14 rounded object-cover bg-kemo-gray-700"
                        />
                        <span className="font-medium">{movie.title}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-brand-gold" />
                        <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-brand-gold" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-brand-gold" />
                        <span>{Math.round(movie.popularity)}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <button 
                        onClick={() => {/* Handle movie details */}}
                        className="p-2 hover:bg-kemo-gray-700 rounded-lg transition-colors"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}