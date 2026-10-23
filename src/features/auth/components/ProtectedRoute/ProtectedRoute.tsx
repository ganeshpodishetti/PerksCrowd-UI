'use client'
import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { hasAnyRole } from '../../utils/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  /** When set, the signed-in user must have one of these roles. */
  requiredRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  redirectTo = '/auth/login',
  requiredRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAllowed =
    isAuthenticated && (!requiredRoles || hasAnyRole(user, requiredRoles));

  useAuthRedirect({
    isAuthenticated: isAllowed,
    isLoading,
    // Signed in but wrong role: send to the profile, not the login page.
    whenUnauthenticated: isAuthenticated ? '/profile' : redirectTo,
  });

  if (isLoading) {
    // Show a loading spinner while auth state is being resolved
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary"></div>
      </div>
    );
  }

  if (!isAllowed) {
    // Don't render anything while redirecting
    return null;
  }
  return <>{children}</>;
};
