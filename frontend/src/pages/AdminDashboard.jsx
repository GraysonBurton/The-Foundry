import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { API } = useAuth();
  const [tab, setTab] = useState("menu");

  // Menu state
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuForm, setMenuForm] = useState({
    name: "", description: "", price: "", category: "main-course",
    image: "", ingredients: "", allergens: "", dietaryTags: [],
    isAvailable: true, isSpecial: false, prepTime: 15,
  });
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuError, setMenuError] = useState("");
  const [showMenuForm, setShowMenuForm] = useState(false);

  // Reservations state
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(true);

  // Reviews state
  const [allReviews, setAllReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [adminResponseText, setAdminResponseText] = useState({});

  // Stats
  const [stats, setStats] = useState({ menuCount: 0, resCount: 0, orderCount: 0 });

  useEffect(() => {
    loadMenu();
    loadReservations();
    loadStats();
  }, []);

  const loadMenu = () => {
    API.get("/menu")
      .then((res) => setMenuItems(res.data))
      .catch(() => {})
      .finally(() => setMenuLoading(false));
  };

  const loadReservations = () => {
    API.get("/reservations")
      .then((res) => setReservations(res.data))
      .catch(() => {})
      .finally(() => setResLoading(false));
  };

  const loadStats = async () => {
    try {
      const [menuRes, resRes, orderRes] = await Promise.all([
        API.get("/menu"),
        API.get("/reservations"),
        API.get("/orders"),
      ]);
      setStats({
        menuCount: menuRes.data.length,
        resCount: resRes.data.length,
        orderCount: orderRes.data.length,
      });
    } catch {}
  };

  const loadReviewsForItem = async (menuItemId) => {
    setReviewsLoading(true);
    try {
      const res = await API.get(`/reviews/${menuItemId}`);
      setAllReviews(res.data);
    } catch {
      setAllReviews([]);
    }
    setReviewsLoading(false);
  };

  // ===== Menu CRUD =====
  const resetMenuForm = () => {
    setMenuForm({
      name: "", description: "", price: "", category: "main-course",
      image: "", ingredients: "", allergens: "", dietaryTags: [],
      isAvailable: true, isSpecial: false, prepTime: 15,
    });
    setEditingMenu(null);
    setMenuError("");
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setMenuError("");
    const payload = {
      ...menuForm,
      price: parseFloat(menuForm.price),
      prepTime: parseInt(menuForm.prepTime),
      ingredients: typeof menuForm.ingredients === "string"
        ? menuForm.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
        : menuForm.ingredients,
      allergens: typeof menuForm.allergens === "string"
        ? menuForm.allergens.split(",").map((s) => s.trim()).filter(Boolean)
        : menuForm.allergens,
    };
    try {
      if (editingMenu) {
        const res = await API.put(`/menu/${editingMenu}`, payload);
        setMenuItems(menuItems.map((m) => (m._id === editingMenu ? res.data : m)));
      } else {
        const res = await API.post("/menu", payload);
        setMenuItems([...menuItems, res.data]);
      }
      resetMenuForm();
      setShowMenuForm(false);
      loadStats();
    } catch (err) {
      setMenuError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to save menu item."
      );
    }
  };

  const handleMenuEdit = (item) => {
    setEditingMenu(item._id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || "",
      ingredients: item.ingredients?.join(", ") || "",
      allergens: item.allergens?.join(", ") || "",
      dietaryTags: item.dietaryTags || [],
      isAvailable: item.isAvailable,
      isSpecial: item.isSpecial,
      prepTime: item.prepTime || 15,
    });
    setShowMenuForm(true);
  };

  const handleMenuDelete = async (id) => {
    if (!window.confirm("Delete this menu item permanently?")) return;
    try {
      await API.delete(`/menu/${id}`);
      setMenuItems(menuItems.filter((m) => m._id !== id));
      loadStats();
    } catch {
      alert("Failed to delete menu item.");
    }
  };

  // ===== Reservation Admin =====
  const handleResStatusUpdate = async (id, status) => {
    try {
      const res = await API.put(`/reservations/${id}`, { status });
      setReservations(reservations.map((r) => (r._id === id ? res.data : r)));
    } catch {
      alert("Failed to update reservation status.");
    }
  };

  const handleResDelete = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;
    try {
      await API.delete(`/reservations/${id}`);
      setReservations(reservations.filter((r) => r._id !== id));
      loadStats();
    } catch {
      alert("Failed to delete reservation.");
    }
  };

  // ===== Review Admin Response =====
  const handleAdminResponse = async (reviewId) => {
    const text = adminResponseText[reviewId];
    if (!text?.trim()) return;
    try {
      const res = await API.put(`/reviews/${reviewId}`, { adminResponse: text });
      setAllReviews(allReviews.map((r) => (r._id === reviewId ? res.data : r)));
      setAdminResponseText({ ...adminResponseText, [reviewId]: "" });
    } catch {
      alert("Failed to add response.");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      setAllReviews(allReviews.filter((r) => r._id !== reviewId));
    } catch {
      alert("Failed to delete review.");
    }
  };

  const dietaryOptions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free", "spicy"];

  const toggleDietaryTag = (tag) => {
    setMenuForm((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));
  };

  return (
    <div className="page-content section-dark" style={{ paddingTop: "2rem" }}>
      <div className="container">
        <h2 className="section-title">Admin Dashboard</h2>
        <p className="section-subtitle">Manage menu items, reservations, and reviews</p>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          {[
            { label: "Menu Items", value: stats.menuCount },
            { label: "Reservations", value: stats.resCount },
            { label: "Orders", value: stats.orderCount },
          ].map((s, i) => (
            <div className="col-md-4" key={i}>
              <div className="admin-stat-card">
                <h3>{s.value}</h3>
                <p className="mb-0">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Tabs */}
        <div className="d-flex gap-2 justify-content-center flex-wrap mb-4">
          {[
            { key: "menu", label: "Menu Management" },
            { key: "reservations", label: "Reservations" },
            { key: "reviews", label: "Reviews" },
          ].map((t) => (
            <button key={t.key} className={`filter-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ========== MENU TAB ========== */}
        {tab === "menu" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ color: "var(--color-cream)", fontFamily: "var(--font-display)", margin: 0 }}>
                Menu Catalog
              </h5>
              <button
                className="btn btn-gold btn-sm"
                onClick={() => { resetMenuForm(); setShowMenuForm(!showMenuForm); }}
              >
                {showMenuForm ? "Close Form" : "+ Add Dish"}
              </button>
            </div>

            {/* Menu Form */}
            {showMenuForm && (
              <div className="review-card mb-4">
                <h5 style={{ color: "var(--color-gold)" }}>
                  {editingMenu ? "Edit Dish" : "Add New Dish"}
                </h5>
                {menuError && <div className="alert alert-danger py-2">{menuError}</div>}
                <form onSubmit={handleMenuSubmit} className="form-dark">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" value={menuForm.name}
                        onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Price ($)</label>
                      <input type="number" step="0.01" className="form-control" value={menuForm.price}
                        onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows="2" value={menuForm.description}
                        onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={menuForm.category}
                        onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}>
                        <option value="appetizer">Appetizer</option>
                        <option value="main-course">Main Course</option>
                        <option value="beverage">Beverage</option>
                        <option value="dessert">Dessert</option>
                        <option value="side">Side</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Prep Time (min)</label>
                      <input type="number" className="form-control" value={menuForm.prepTime}
                        onChange={(e) => setMenuForm({ ...menuForm, prepTime: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Image URL</label>
                      <input type="text" className="form-control" value={menuForm.image}
                        onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ingredients (comma-separated)</label>
                      <input type="text" className="form-control" value={menuForm.ingredients}
                        onChange={(e) => setMenuForm({ ...menuForm, ingredients: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Allergens (comma-separated)</label>
                      <input type="text" className="form-control" value={menuForm.allergens}
                        onChange={(e) => setMenuForm({ ...menuForm, allergens: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Dietary Tags</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {dietaryOptions.map((tag) => (
                          <button key={tag} type="button"
                            className={`filter-btn ${menuForm.dietaryTags.includes(tag) ? "active" : ""}`}
                            onClick={() => toggleDietaryTag(tag)} style={{ fontSize: "0.75rem" }}>
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" checked={menuForm.isAvailable}
                          onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })} id="availCheck" />
                        <label className="form-check-label" htmlFor="availCheck" style={{ color: "var(--color-text)" }}>Available</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" checked={menuForm.isSpecial}
                          onChange={(e) => setMenuForm({ ...menuForm, isSpecial: e.target.checked })} id="specialCheck" />
                        <label className="form-check-label" htmlFor="specialCheck" style={{ color: "var(--color-text)" }}>Chef's Special</label>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-gold">{editingMenu ? "Update Dish" : "Add Dish"}</button>
                    <button type="button" className="btn btn-outline-gold" onClick={() => { resetMenuForm(); setShowMenuForm(false); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Menu List Table */}
            {menuLoading ? (
              <div className="loading-container"><div className="spinner-border" style={{ color: "var(--color-gold)" }}></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-foundry table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: "var(--color-gold)" }}>Dish</th>
                      <th style={{ color: "var(--color-gold)" }}>Category</th>
                      <th style={{ color: "var(--color-gold)" }}>Price</th>
                      <th style={{ color: "var(--color-gold)" }}>Status</th>
                      <th style={{ color: "var(--color-gold)" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {item.image && (
                              <img src={item.image} alt="" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                            )}
                            <div>
                              <strong style={{ color: "var(--color-cream)" }}>{item.name}</strong>
                              {item.isSpecial && <span className="badge bg-warning text-dark ms-1" style={{ fontSize: "0.6rem" }}>SPECIAL</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ textTransform: "capitalize" }}>{item.category.replace("-", " ")}</td>
                        <td style={{ color: "var(--color-gold)" }}>${item.price.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${item.isAvailable ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.7rem" }}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-outline-gold btn-sm" style={{ fontSize: "0.7rem" }}
                              onClick={() => handleMenuEdit(item)}>Edit</button>
                            <button className="btn btn-sm" style={{ fontSize: "0.7rem", color: "var(--color-danger)", border: "1px solid var(--color-danger)" }}
                              onClick={() => handleMenuDelete(item._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========== RESERVATIONS TAB ========== */}
        {tab === "reservations" && (
          <div>
            <h5 style={{ color: "var(--color-cream)", fontFamily: "var(--font-display)" }}>All Reservations</h5>
            {resLoading ? (
              <div className="loading-container"><div className="spinner-border" style={{ color: "var(--color-gold)" }}></div></div>
            ) : reservations.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No reservations found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-foundry table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ color: "var(--color-gold)" }}>Guest</th>
                      <th style={{ color: "var(--color-gold)" }}>Date / Time</th>
                      <th style={{ color: "var(--color-gold)" }}>Party</th>
                      <th style={{ color: "var(--color-gold)" }}>Status</th>
                      <th style={{ color: "var(--color-gold)" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res._id}>
                        <td>
                          <strong style={{ color: "var(--color-cream)" }}>{res.firstName} {res.lastName}</strong>
                          <br /><small style={{ color: "var(--color-text-muted)" }}>{res.email}</small>
                        </td>
                        <td>{new Date(res.date).toLocaleDateString()} at {res.time}</td>
                        <td>{res.partySize}</td>
                        <td>
                          <span className={`badge ${res.status === "confirmed" ? "bg-success" : res.status === "cancelled" ? "bg-danger" : "bg-warning text-dark"}`}
                            style={{ fontSize: "0.7rem" }}>{res.status}</span>
                        </td>
                        <td>
                          <div className="d-flex gap-1 flex-wrap">
                            {res.status !== "completed" && res.status !== "cancelled" && (
                              <button className="btn btn-sm btn-outline-gold" style={{ fontSize: "0.68rem" }}
                                onClick={() => handleResStatusUpdate(res._id, "completed")}>Complete</button>
                            )}
                            <button className="btn btn-sm" style={{ fontSize: "0.68rem", color: "var(--color-danger)", border: "1px solid var(--color-danger)" }}
                              onClick={() => handleResDelete(res._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========== REVIEWS TAB ========== */}
        {tab === "reviews" && (
          <div>
            <h5 style={{ color: "var(--color-cream)", fontFamily: "var(--font-display)" }}>Review Moderation</h5>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
              Select a menu item to view and moderate its reviews.
            </p>
            <div className="d-flex gap-2 flex-wrap mb-4">
              {menuItems.slice(0, 12).map((item) => (
                <button key={item._id} className="filter-btn" style={{ fontSize: "0.75rem" }}
                  onClick={() => loadReviewsForItem(item._id)}>
                  {item.name}
                </button>
              ))}
            </div>

            {reviewsLoading ? (
              <div className="loading-container"><div className="spinner-border" style={{ color: "var(--color-gold)" }}></div></div>
            ) : allReviews.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>
                {menuItems.length > 0 ? "Select a dish above or no reviews found for this dish." : "Loading..."}
              </p>
            ) : (
              allReviews.map((review) => (
                <div className="review-card" key={review._id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong style={{ color: "var(--color-cream)" }}>
                        {review.user?.firstName} {review.user?.lastName}
                      </strong>
                      <div>
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={s <= review.rating ? "star-filled" : "star-empty"}>★</span>
                        ))}
                      </div>
                    </div>
                    <small style={{ color: "var(--color-text-muted)" }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                  </div>
                  <p className="mt-2 mb-1" style={{ color: "var(--color-text)" }}>{review.comment}</p>
                  {review.adminResponse && (
                    <div className="p-2 mt-1" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px" }}>
                      <small style={{ color: "var(--color-gold)" }}><strong>Your Response:</strong></small>
                      <p className="mb-0" style={{ fontSize: "0.85rem" }}>{review.adminResponse}</p>
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="d-flex gap-2 align-items-end">
                      <input type="text" className="form-control form-control-sm"
                        placeholder="Add admin response..."
                        value={adminResponseText[review._id] || ""}
                        onChange={(e) => setAdminResponseText({ ...adminResponseText, [review._id]: e.target.value })}
                        style={{ background: "var(--color-bg)", border: "1px solid rgba(201,168,76,0.2)", color: "var(--color-text)", maxWidth: "300px" }} />
                      <button className="btn btn-outline-gold btn-sm" style={{ fontSize: "0.72rem" }}
                        onClick={() => handleAdminResponse(review._id)}>Respond</button>
                      <button className="btn btn-sm" style={{ fontSize: "0.72rem", color: "var(--color-danger)", border: "1px solid var(--color-danger)" }}
                        onClick={() => handleReviewDelete(review._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
