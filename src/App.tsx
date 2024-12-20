// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
import Landing from './pages/landing/index';
import Home from './pages/home';
import MovieDetails from './pages/movies/[id]';
import SettingsPage from './pages/settings';
import Dashboard from './pages/dashboard';
import ProfilePage from './pages/profile';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Authenticated Routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/dashboard" element={<Dashboard /> } />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}