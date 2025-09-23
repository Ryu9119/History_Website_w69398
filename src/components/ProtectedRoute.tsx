import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../lib/auth-api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authApi.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login with return path
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

