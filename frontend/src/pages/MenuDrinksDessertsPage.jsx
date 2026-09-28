import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MenuDrinksDessertsPage() {
  const { API } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/menu")
      .then((res) => {
        const drinksAndDesserts = res.data.filter((i) =>
          ["beverage", "dessert"].includes(i.category)
        );
        setItems(drinksAndDesserts);
      })
      .catch(() => setError("Failed to load menu items."))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: "all", label: "All" },
    { key: "beverage", label: "Beverages" },
    { key: "dessert", label: "Desserts" },
  ];

  const dietaryOptions = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
  ];

  const toggleDietary = (tag) => {
    setDietaryFilter((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = items.filter((item) => {
    const catMatch = activeCategory === "all" || item.category === activeCategory;
    const dietMatch =
      dietaryFilter.length === 0 ||
      dietaryFilter.every((tag) => item.dietaryTags?.includes(tag));
    return catMatch && dietMatch;
  });

  return (
    <div className="page-content">
      <section
        className="hero-section"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1400)",
          minHeight: "40vh",
        }}
      >
        <div className="hero-content">
          <h1>Drinks & Desserts</h1>
          <p>Handcrafted cocktails, refreshing beverages, and indulgent sweets</p>
        </div>
      </section>

      <section className="section-dark">
        <div className="container">
          {/* Category Filters */}
          <div className="d-flex gap-2 justify-content-center flex-wrap mb-3">
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

          {/* Dietary Filters */}
          <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
            <span style={{ color: "var(--color-text-muted)", fontSize: "0.82rem", lineHeight: "2" }}>
              Dietary:
            </span>
            {dietaryOptions.map((tag) => (
              <button
                key={tag}
                className={`filter-btn ${dietaryFilter.includes(tag) ? "active" : ""}`}
                onClick={() => toggleDietary(tag)}
                style={{ fontSize: "0.78rem" }}
              >
                {tag}
              </button>
            ))}
            {dietaryFilter.length > 0 && (
              <button
                className="filter-btn"
                onClick={() => setDietaryFilter([])}
                style={{ color: "var(--color-danger)" }}
              >
                Clear
              </button>
            )}
          </div>

          {error && <div className="alert alert-danger text-center">{error}</div>}

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
                              Featured
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
                              <span key={tag} className={`dietary-tag tag-${tag}`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-5">
                    <p style={{ color: "var(--color-text-muted)" }}>
                      No items match your filters. Try adjusting your selection.
                    </p>
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
