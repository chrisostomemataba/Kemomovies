// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (requireAuth && !user) {
    // Redirect to login if trying to access protected route while not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // Redirect to home if trying to access auth routes while authenticated
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}