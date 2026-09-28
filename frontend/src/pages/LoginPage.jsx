import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>The Foundry</h2>
        <p className="text-center mb-4" style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          Sign in to your account
        </p>

        {error && <div className="alert alert-danger py-2 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="form-dark">
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--color-gold)" }}>Create one</Link>
        </p>

        <div className="mt-4 p-3" style={{ background: "var(--color-bg)", borderRadius: "4px", fontSize: "0.8rem" }}>
          <p className="mb-1" style={{ color: "var(--color-gold)", fontWeight: 600 }}>Demo Accounts:</p>
          <p className="mb-0" style={{ color: "var(--color-text-muted)" }}>
            <strong>Admin:</strong> admin@thefoundry.com / admin123<br />
            <strong>User:</strong> john@example.com / user123
          </p>
        </div>
      </div>
    </div>
  );
}
