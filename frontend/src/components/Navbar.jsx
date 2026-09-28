import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg foundry-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">The Foundry</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/our-story">Our Story</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/menu/main">Main Courses</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/menu/drinks-desserts">
                Drinks & Desserts
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-account">
                  My Orders
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/team">Team / FAQ</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  style={{ color: "var(--color-gold)" }}
                >
                  {user.firstName}
                  {isAdmin && (
                    <span className="badge bg-warning text-dark ms-1" style={{ fontSize: "0.65rem" }}>
                      ADMIN
                    </span>
                  )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" style={{ background: "#1a1a1a", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <li>
                    <Link className="dropdown-item" to="/my-account" style={{ color: "#e8e8e8" }}>
                      My Account
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" style={{ borderColor: "rgba(201,168,76,0.15)" }} /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout} style={{ color: "#c0392b" }}>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Sign In</NavLink>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-gold btn-sm ms-2" to="/signup" style={{ marginTop: "4px" }}>
                    Join Us
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
