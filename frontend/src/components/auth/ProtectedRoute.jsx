import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("cura_token");
  const storedUser = localStorage.getItem("cura_user");

  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("cura_token");
    localStorage.removeItem("cura_user");

    return <Navigate to="/" replace />;
  }

  const role = String(user.role || "")
    .trim()
    .toLowerCase();

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    if (role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (role === "doctor") {
      return (
        <Navigate
          to="/doctor/dashboard"
          replace
        />
      );
    }

    if (role === "staff") {
      return (
        <Navigate
          to="/staff/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;