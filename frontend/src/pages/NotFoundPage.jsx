import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      className="page-content d-flex align-items-center justify-content-center"
      style={{ minHeight: "70vh", textAlign: "center" }}
    >
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "8rem",
            color: "var(--color-gold)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          404
        </h1>
        <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-cream)" }}>
          Page Not Found
        </h3>
        <p style={{ color: "var(--color-text-muted)", maxWidth: "400px", margin: "0 auto 1.5rem" }}>
          Looks like this table doesn't exist. Let us guide you back to the dining room.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/" className="btn btn-gold">Return Home</Link>
          <Link to="/menu/main" className="btn btn-outline-gold">View Menu</Link>
        </div>
      </div>
    </div>
  );
}
