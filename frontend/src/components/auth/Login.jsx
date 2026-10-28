import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/auth.css";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuth } from "../../context/useAuth";
import authService from "../../shared/services/authService";
import {
  getRoleLandingPath,
  normalizeRole,
} from "../../shared/utils/authUtils";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const {
    login,
    loading: authLoading,
    user,
    isAuthenticated,
  } = useAuth();

  const landingPath = getRoleLandingPath(user?.role);

  if (authLoading) {
    return <LoadingSpinner text="Checking your session..." />;
  }

  if (isAuthenticated && landingPath) {
    return <Navigate to={landingPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login({
        email,
        password,
        remember,
      });
      const role = normalizeRole(data?.user?.role);
      const roleLandingPath = getRoleLandingPath(role);

      if (!roleLandingPath) {
        setErrorMessage("Your account does not have a valid CURA role.");
        return;
      }

      login(data.user, data.token);
      navigate(roleLandingPath, { replace: true });
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Unable to sign in. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-layout">

        {/* LEFT SIDE */}
        <div className="welcome-panel">

          <div className="brand">
            <div className="brand-icon">+</div>

            <div>
              <h1>CURA</h1>
              <p>HEALTHCARE MADE SMARTER</p>
            </div>
          </div>

          <div className="welcome-content">
            <h2>
              Smarter Healthcare.
              <span>Better Coordination.</span>
            </h2>

            <p>
              Connecting patients, healthcare providers,
              and facilities for a healthier tomorrow.
            </p>

            <div className="features">
              <div>✓ Efficient Patient Care</div>
              <div>✓ Centralized Health Records</div>
              <div>✓ A More Connected Community</div>
            </div>
          </div>

          <p className="priority">
            <strong>Your Health.</strong> Our Priority.
          </p>
        </div>

        {/* LOGIN CARD */}
        <section className="login-card">

          <p className="new-account">
            New here?{" "}
            <a href="#create-account">
              Create an account
            </a>
          </p>

          <h2>Welcome Back</h2>

          <p className="subtitle">
            Sign in to continue to CURA
          </p>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-field">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="form-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) =>
                    setRemember(
                      event.target.checked
                    )
                  }
                  disabled={loading}
                />

                Remember me
              </label>

              <a href="#forgot-password">
                Forgot password?
              </a>
            </div>

            {/* ERROR */}
            {errorMessage && (
              <p className="login-error">
                {errorMessage}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              className="sign-in-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button type="button">
              Google
            </button>

            <button type="button">
              Microsoft
            </button>
          </div>

          <p className="security-note">
            🛡️{" "}
            <strong>
              Secure. Private. Compliant.
            </strong>

            <br />

            Your data is protected with
            industry-standard security.
          </p>
        </section>
      </section>
    </main>
  );
}

export default Login;