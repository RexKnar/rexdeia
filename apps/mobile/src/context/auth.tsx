import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, registerAuthExpiredHandler } from '../lib/api';
import { AuthStorage } from '../lib/storage';
import { clearQueryCache } from '../providers/QueryProvider';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  staffId: string | null;
  branchId: string;
  organizationId: string;
  currentBatch: string;
  picture?: string;
  username?: string;
  organizationName?: string;
  academicYear?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await api.get<{
        success: boolean;
        organizationName?: string;
        academicYear?: string;
        user?: any;
      }>('/api/mobile/v1/auth/session');
      if (res?.organizationName || res?.academicYear) {
        setUser((prev) => {
          if (!prev) return prev;
          const updated: AuthUser = {
            ...prev,
            organizationName: res.organizationName || prev.organizationName,
            academicYear: res.academicYear || prev.academicYear,
          };
          AuthStorage.saveUser(updated).catch(() => {});
          return updated;
        });
      }
    } catch {}
  };

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const storedUser = await AuthStorage.getUser();
        const token = await AuthStorage.getAccessToken();
        if (storedUser && token) {
          setUser(storedUser);
          // Refresh organization and academic year in background
          refreshSession();
        }
      } catch (err) {
        console.warn('Failed to load session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();

    registerAuthExpiredHandler(() => {
      setUser(null);
    });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post(
        '/api/mobile/v1/auth',
        { email, password },
        { skipAuth: true }
      );

      if (!data.accessToken || !data.user) {
        throw new Error('INVALID_AUTH_RESPONSE');
      }

      await AuthStorage.saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      await AuthStorage.saveUser(data.user);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await clearQueryCache();
      await AuthStorage.clearAll();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
