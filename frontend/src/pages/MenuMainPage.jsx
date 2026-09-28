import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MenuMainPage() {
  const { API } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/menu")
      .then((res) => {
        const mainItems = res.data.filter((i) =>
          ["main-course", "appetizer", "side"].includes(i.category)
        );
        setItems(mainItems);
      })
      .catch(() => setError("Failed to load menu items. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: "all", label: "All" },
    { key: "appetizer", label: "Appetizers" },
    { key: "main-course", label: "Main Courses" },
    { key: "side", label: "Sides" },
  ];

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  return (
    <div className="page-content">
      <section
        className="hero-section"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400)",
          minHeight: "40vh",
        }}
      >
        <div className="hero-content">
          <h1>Our Menu</h1>
          <p>Main courses, appetizers, and sides — crafted with care</p>
        </div>
      </section>

      <section className="section-dark">
        <div className="container">
          {/* Category Filters */}
          <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`filter-btn ${activeCategory === cat.key ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner-border" style={{ color: "var(--color-gold)" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center mb-4" style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="row g-4">
                {filtered.map((item) => (
                  <div className="col-sm-6 col-lg-4" key={item._id}>
                    <Link to={`/menu/${item._id}`} style={{ textDecoration: "none" }}>
                      <div className="menu-card">
                        <div style={{ position: "relative" }}>
                          <img src={item.image} alt={item.name} />
                          {!item.isAvailable && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "rgba(0,0,0,0.7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#c0392b",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                textTransform: "uppercase",
                              }}
                            >
                              Currently Unavailable
                            </div>
                          )}
                          {item.isSpecial && (
                            <span
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "var(--color-gold)",
                                color: "#0d0d0d",
                                padding: "0.2rem 0.6rem",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                borderRadius: "2px",
                              }}
                            >
                              Chef's Special
                            </span>
                          )}
                        </div>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title mb-0">{item.name}</h5>
                            <span className="price">${item.price.toFixed(2)}</span>
                          </div>
                          <p className="card-text">{item.description}</p>
                          <div className="mt-2">
                            {item.dietaryTags?.map((tag) => (
                              <span key={tag} className={`dietary-tag tag-${tag}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-5">
                    <p style={{ color: "var(--color-text-muted)" }}>No items found in this category.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
