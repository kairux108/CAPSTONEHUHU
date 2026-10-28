import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AuthContext from "./authContext";
import authService from "../shared/services/authService";
import { setUnauthorizedHandler } from "../shared/services/api";
import { normalizeRole } from "../shared/utils/authUtils";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("cura_token");
    localStorage.removeItem("cura_user");
    setUser(null);
    setLoading(false);
  }, []);

  const login = useCallback((userData, token) => {
    if (!token) {
      throw new Error("The login response did not include an access token.");
    }

    const authenticatedUser = {
      ...userData,
      role: normalizeRole(userData?.role),
    };

    localStorage.setItem("cura_token", token);
    localStorage.setItem("cura_user", JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const unregisterUnauthorizedHandler =
      setUnauthorizedHandler(logout);

    const restoreSession = async () => {
      if (!localStorage.getItem("cura_token")) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      try {
        const response = await authService.getCurrentUser();
        const restoredUser = response?.user;

        if (!restoredUser || !normalizeRole(restoredUser.role)) {
          logout();
          return;
        }

        if (!cancelled) {
          const authenticatedUser = {
            ...restoredUser,
            role: normalizeRole(restoredUser.role),
          };
          localStorage.setItem(
            "cura_user",
            JSON.stringify(authenticatedUser)
          );
          setUser(authenticatedUser);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
      unregisterUnauthorizedHandler();
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
