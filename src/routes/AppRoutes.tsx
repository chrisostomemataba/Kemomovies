// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import LandingLayout from '../layouts/LandingLayout';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import Landing from '../pages/landing/index';
import Home from '../pages/home';
import MovieDetails from '../pages/movies/[id]';
import SettingsPage from '../pages/settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>
      
      <Route element={<AuthenticatedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Route>
    </Routes>
  );
}