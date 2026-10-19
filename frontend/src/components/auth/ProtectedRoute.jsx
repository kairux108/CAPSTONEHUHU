import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/useAuth";
import { getRoleLandingPath, normalizeRole } from "../../utils/authUtils";
import LoadingSpinner from "../common/LoadingSpinner";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !getRoleLandingPath(user?.role)) {
      logout();
    }
  }, [isAuthenticated, logout, user?.role]);

  if (loading) {
    return <LoadingSpinner text="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  const role = normalizeRole(user?.role);

  if (!getRoleLandingPath(role)) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getRoleLandingPath(role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
