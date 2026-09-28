import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { API } = useAuth();
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/menu?special=true")
      .then((res) => setSpecials(res.data.slice(0, 4)))
      .catch(() => setSpecials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-content">
      {/* Hero */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400)",
          minHeight: "80vh",
        }}
      >
        <div className="hero-content">
          <p
            style={{
              color: "var(--color-gold)",
              textTransform: "uppercase",
              letterSpacing: "4px",
              fontSize: "0.85rem",
              marginBottom: "0.8rem",
            }}
          >
            Est. 2026 · Ames, Iowa
          </p>
          <h1>The Foundry</h1>
          <p>
            Where culinary artistry meets timeless tradition. Experience dining
            reimagined through bold flavors and meticulous craft.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/menu/main" className="btn btn-gold">
              Explore Our Menu
            </Link>
            <Link to="/my-account" className="btn btn-outline-gold">
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Chef's Specials */}
      <section className="section-dark">
        <div className="container">
          <h2 className="section-title">Chef's Specials</h2>
          <p className="section-subtitle">
            Hand-selected dishes that define our culinary identity
          </p>
          <div className="gold-divider"></div>

          {loading ? (
            <div className="loading-container">
              <div
                className="spinner-border"
                style={{ color: "var(--color-gold)" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {specials.map((item) => (
                <div className="col-md-6 col-lg-3" key={item._id}>
                  <Link
                    to={`/menu/${item._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="menu-card">
                      <img src={item.image} alt={item.name} />
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
            </div>
          )}
        </div>
      </section>

      {/* Why The Foundry */}
      <section className="section-elevated">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=700"
                alt="The Foundry Kitchen"
                className="img-fluid"
                style={{ borderRadius: "4px" }}
              />
            </div>
            <div className="col-lg-6">
              <p
                style={{
                  color: "var(--color-gold)",
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  fontSize: "0.8rem",
                }}
              >
                Our Philosophy
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  color: "var(--color-cream)",
                  marginBottom: "1rem",
                }}
              >
                Forged in Flavor
              </h2>
              <p style={{ color: "var(--color-text-muted)", lineHeight: "1.8" }}>
                At The Foundry, every dish is a testament to the art of
                transformation. We source the finest seasonal ingredients and
                shape them through time-honored techniques and bold modern
                innovation. Our kitchen is our forge — and every plate that
                leaves it carries the fire of our passion.
              </p>
              <Link to="/our-story" className="btn btn-outline-gold mt-2">
                Read Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="section-dark">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              {
                title: "The Menu",
                desc: "Explore our full collection of dishes, drinks, and desserts.",
                link: "/menu/main",
                icon: "🍽️",
              },
              {
                title: "Reserve a Table",
                desc: "Book your unforgettable dining experience with us.",
                link: "/my-account",
                icon: "📅",
              },
              {
                title: "Our Heritage",
                desc: "Learn the story behind The Foundry and our culinary vision.",
                link: "/our-story",
                icon: "🔥",
              },
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div
                  style={{
                    background: "var(--color-bg-card)",
                    border: "1px solid rgba(201,168,76,0.1)",
                    borderRadius: "4px",
                    padding: "2rem",
                    height: "100%",
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                    {item.icon}
                  </div>
                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-cream)",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                    {item.desc}
                  </p>
                  <Link to={item.link} className="btn btn-outline-gold btn-sm">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
