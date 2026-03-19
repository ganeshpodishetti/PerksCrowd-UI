"use client";
import { authService } from "@/features/auth/services/authService";
import { ensureClientContext } from '@/shared/utils/runtimeSafety';
import type { User } from "@/shared/types/entities/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fallbackAuthContext: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => undefined,
  register: async () => undefined,
  logout: async () => undefined,
};

export const useAuth = () => {
  return ensureClientContext(
    useContext(AuthContext),
    fallbackAuthContext,
    'useAuth must be used within an AuthProvider',
  );
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      const userProfile = await authService.getUserProfile();
      setUser(userProfile);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.login({ email, password });

      const userProfile = await authService.getUserProfile();
      setUser(userProfile);
    } catch (error) {
      setUser(null);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  /** Returns void; callers that need the response should use authService directly */
  const register = async (email: string, password: string, username: string): Promise<void> => {
    await authService.register({ email, password, username });
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch {
      // silent
    } finally {
      setUser(null);
      setIsLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
