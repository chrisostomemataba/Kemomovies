// src/routes/index.tsx
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LandingPage } from '../pages/landing/index';
import { LoginPage } from '../pages/auth/login';
import { SignupPage } from '../pages/auth/signup';
import { SettingsPage } from '../pages/settings';

import { useAuth } from '../hooks/useAuth';

export function Routes() {
  const { user } = useAuth();

  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Route>

      {/* Protected Routes */}
      <Route 
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
   
        {/* Add more protected routes here */}
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Replace with proper loading component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}