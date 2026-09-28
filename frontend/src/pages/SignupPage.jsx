import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed."
      );
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join The Foundry</h2>
        <p className="text-center mb-4" style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
          Create your account to start ordering
        </p>

        {error && <div className="alert alert-danger py-2 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="form-dark">
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className="col-6">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
          </div>
          <div className="mb-3 mt-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Retype your password" required />
          </div>
          <button type="submit" className="btn btn-gold w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-3" style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--color-gold)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
