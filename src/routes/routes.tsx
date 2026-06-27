import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface GuardProps {
  children: React.ReactNode;
}

// Redirects unauthenticated users to `/login`
export const PrivateRoute: React.FC<GuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirects authenticated users to `/dashboard`
export const PublicRoute: React.FC<GuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
