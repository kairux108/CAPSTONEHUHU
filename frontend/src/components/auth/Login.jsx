import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

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
      const response = await fetch(
        "http://127.0.0.1:8000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            remember,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please try again."
        );
      }

      const role = String(data.user?.role || "")
        .trim()
        .toLowerCase();
      const user = {
        ...data.user,
        role,
      };

      // Save CURA authentication information
      localStorage.setItem("cura_token", data.token);
      localStorage.setItem(
        "cura_user",
        JSON.stringify(user)
      );
      login(user);

      console.log("Login successful:", user);

      // Redirect according to user role
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;

        case "doctor":
          navigate("/doctor-dashboard");
          break;

        case "staff":
          navigate("/staff-dashboard");
          break;

        default:
          localStorage.removeItem("cura_token");
          localStorage.removeItem("cura_user");

          setErrorMessage(
            "Your account does not have a valid CURA role."
          );
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        error.message ||
          "Cannot connect to Laravel. Make sure php artisan serve is running."
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