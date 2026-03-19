'use client'
import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  useAuthRedirect({
    isAuthenticated,
    isLoading,
    whenUnauthenticated: redirectTo,
  });

  if (isLoading) {
    // Show a loading spinner while auth state is being resolved
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Don't render anything while redirecting
    return null;
  }
  return <>{children}</>;
};


