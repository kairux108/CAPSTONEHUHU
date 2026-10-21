import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { AuthUser } from '../features/auth/types/auth';
import {
  getStoredToken,
  logout as logoutRequest,
} from '../features/auth/services/authService';

import api from '../services/api';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type Props = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser = async () => {
    try {
      const token =
        await getStoredToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response =
        await api.get('/user');

      setUser(response.data.user);
    } catch {
      setUser(null);
      await logoutRequest();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: !!user,
        setUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}