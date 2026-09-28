import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border" style={{ color: "var(--color-gold)" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return (
      <div className="page-content d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 style={{ fontSize: "5rem", color: "var(--color-gold)" }}>403</h1>
          <h3>Access Denied</h3>
          <p className="text-muted">You do not have permission to access this page.</p>
          <a href="/" className="btn btn-gold mt-3">Return Home</a>
        </div>
      </div>
    );
  }

  return children;
}
