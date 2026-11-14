
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

  // Manually refresh the authenticated user.
  const refreshUser = async () => {
    try {
      const token = await getStoredToken();

      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get<{
        user: AuthUser;
      }>('/user');

      setUser(response.data.user);
    } catch {
      setUser(null);
      await logoutRequest();
    } finally {
      setLoading(false);
    }
  };

  // Remove the stored authentication token.
  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  // Restore the patient session when CURA opens.
  useEffect(() => {
    let active = true;

    void getStoredToken()
      .then(async (token) => {
        if (!token) {
          return null;
        }

        const response = await api.get<{
          user: AuthUser;
        }>('/user');

        return response.data.user;
      })
      .then((restoredUser) => {
        if (!active) return;

        setUser(restoredUser);
      })
      .catch(async () => {
        if (!active) return;

        setUser(null);

        await logoutRequest();
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      })
      .catch((error: unknown) => {
        console.warn(
          'Unable to complete session cleanup:',
          error
        );
      });

    return () => {
      active = false;
    };
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
