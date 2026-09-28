import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyAccountPage() {
  const { API, user } = useAuth();
  const [tab, setTab] = useState("reservations");

  // ===== Reservations State =====
  const [reservations, setReservations] = useState([]);
  const [resLoading, setResLoading] = useState(true);
  const [resForm, setResForm] = useState({
    date: "",
    time: "18:00",
    partySize: 2,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: "",
    email: user?.email || "",
    specialRequests: "",
  });
  const [editingRes, setEditingRes] = useState(null);
  const [resError, setResError] = useState("");

  // ===== Orders State =====
  const [activeOrder, setActiveOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);

  useEffect(() => {
    loadReservations();
    loadOrders();
  }, []);

  // ===== Reservation Functions =====
  const loadReservations = () => {
    API.get("/reservations")
      .then((res) => setReservations(res.data))
      .catch(() => {})
      .finally(() => setResLoading(false));
  };

  const handleResSubmit = async (e) => {
    e.preventDefault();
    setResError("");
    try {
      if (editingRes) {
        const res = await API.put(`/reservations/${editingRes}`, resForm);
        setReservations(reservations.map((r) => (r._id === editingRes ? res.data : r)));
        setEditingRes(null);
      } else {
        const res = await API.post("/reservations", resForm);
        setReservations([...reservations, res.data]);
      }
      setResForm({
        date: "",
        time: "18:00",
        partySize: 2,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: "",
        email: user?.email || "",
        specialRequests: "",
      });
    } catch (err) {
      setResError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Failed to save reservation."
      );
    }
  };

  const handleResEdit = (res) => {
    setEditingRes(res._id);
    setResForm({
      date: res.date?.split("T")[0] || "",
      time: res.time,
      partySize: res.partySize,
      firstName: res.firstName,
      lastName: res.lastName,
      phone: res.phone,
      email: res.email,
      specialRequests: res.specialRequests || "",
    });
  };

  const handleResDelete = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await API.delete(`/reservations/${id}`);
      setReservations(reservations.filter((r) => r._id !== id));
    } catch {
      alert("Failed to cancel reservation.");
    }
  };

  // ===== Order Functions =====
  const loadOrders = () => {
    API.get("/orders")
      .then((res) => {
        const active = res.data.find((o) => o.status === "active");
        const past = res.data.filter((o) => o.status !== "active");
        setActiveOrder(active || null);
        setPastOrders(past);
      })
      .catch(() => {})
      .finally(() => setOrderLoading(false));
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await API.put(`/orders/update-item/${itemId}`, {
        quantity: newQty,
      });
      setActiveOrder(res.data);
    } catch {
      alert("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const res = await API.delete(`/orders/remove-item/${itemId}`);
      setActiveOrder(res.data);
    } catch {
      alert("Failed to remove item.");
    }
  };

  const handleUpdateInstructions = async (itemId, instructions) => {
    try {
      const res = await API.put(`/orders/update-item/${itemId}`, {
        specialInstructions: instructions,
      });
      setActiveOrder(res.data);
    } catch {
      alert("Failed to update instructions.");
    }
  };

  const handleSubmitOrder = async () => {
    if (!activeOrder || activeOrder.items.length === 0) return;
    try {
      const res = await API.put(`/orders/${activeOrder._id}/submit`);
      setPastOrders([res.data, ...pastOrders]);
      setActiveOrder(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit order.");
    }
  };

  return (
    <div className="page-content section-dark" style={{ paddingTop: "2rem" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        <h2 className="section-title">My Account</h2>
        <p className="section-subtitle">
          Welcome back, {user?.firstName}! Manage your reservations and orders.
        </p>

        {/* Tab Buttons */}
        <div className="d-flex gap-2 justify-content-center mb-4">
          <button
            className={`filter-btn ${tab === "reservations" ? "active" : ""}`}
            onClick={() => setTab("reservations")}
          >
            Reservations
          </button>
          <button
            className={`filter-btn ${tab === "orders" ? "active" : ""}`}
            onClick={() => setTab("orders")}
          >
            My Orders
          </button>
        </div>

        {/* ========== RESERVATIONS TAB ========== */}
        {tab === "reservations" && (
          <div>
            {/* Reservation Form */}
            <div className="review-card mb-4">
              <h5 style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)" }}>
                {editingRes ? "Update Reservation" : "Book a Table"}
              </h5>
              {resError && <div className="alert alert-danger py-2">{resError}</div>}
              <form onSubmit={handleResSubmit} className="form-dark">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={resForm.date}
                      onChange={(e) => setResForm({ ...resForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Time</label>
                    <select
                      className="form-select"
                      value={resForm.time}
                      onChange={(e) => setResForm({ ...resForm, time: e.target.value })}
                    >
                      {["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Party Size</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="20"
                      value={resForm.partySize}
                      onChange={(e) => setResForm({ ...resForm, partySize: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resForm.firstName}
                      onChange={(e) => setResForm({ ...resForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={resForm.lastName}
                      onChange={(e) => setResForm({ ...resForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={resForm.phone}
                      onChange={(e) => setResForm({ ...resForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={resForm.email}
                      onChange={(e) => setResForm({ ...resForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Special Requests (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={resForm.specialRequests}
                      onChange={(e) => setResForm({ ...resForm, specialRequests: e.target.value })}
                      placeholder="Allergies, celebrations, seating preferences..."
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-gold">
                    {editingRes ? "Update Reservation" : "Confirm Reservation"}
                  </button>
                  {editingRes && (
                    <button
                      type="button"
                      className="btn btn-outline-gold"
                      onClick={() => {
                        setEditingRes(null);
                        setResForm({
                          date: "", time: "18:00", partySize: 2,
                          firstName: user?.firstName || "", lastName: user?.lastName || "",
                          phone: "", email: user?.email || "", specialRequests: "",
                        });
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Reservation List */}
            <h5 style={{ color: "var(--color-cream)", fontFamily: "var(--font-display)" }}>
              Your Reservations
            </h5>
            {resLoading ? (
              <div className="loading-container">
                <div className="spinner-border" style={{ color: "var(--color-gold)" }}></div>
              </div>
            ) : reservations.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No reservations yet.</p>
            ) : (
              reservations.map((res) => (
                <div className="review-card" key={res._id}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap">
                    <div>
                      <strong style={{ color: "var(--color-cream)" }}>
                        {new Date(res.date).toLocaleDateString("en-US", {
                          weekday: "long", year: "numeric", month: "long", day: "numeric",
                        })}
                      </strong>
                      <span style={{ color: "var(--color-gold)", marginLeft: "0.5rem" }}>
                        at {res.time}
                      </span>
                      <p className="mb-0 mt-1" style={{ color: "var(--color-text-muted)", fontSize: "0.88rem" }}>
                        Party of {res.partySize} · {res.firstName} {res.lastName}
                        {res.specialRequests && ` · "${res.specialRequests}"`}
                      </p>
                    </div>
                    <span
                      className="badge mt-1"
                      style={{
                        background:
                          res.status === "confirmed" ? "var(--color-success)" :
                          res.status === "cancelled" ? "var(--color-danger)" : "var(--color-gold)",
                        color: "#fff",
                        fontSize: "0.72rem",
                      }}
                    >
                      {res.status}
                    </span>
                  </div>
                  {res.status !== "cancelled" && res.status !== "completed" && (
                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-outline-gold btn-sm" style={{ fontSize: "0.75rem" }} onClick={() => handleResEdit(res)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ fontSize: "0.75rem", color: "var(--color-danger)", border: "1px solid var(--color-danger)" }}
                        onClick={() => handleResDelete(res._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ========== ORDERS TAB ========== */}
        {tab === "orders" && (
          <div>
            {/* Active Order / Cart */}
            <h5 style={{ color: "var(--color-gold)", fontFamily: "var(--font-display)" }}>
              Active Cart
            </h5>
            {orderLoading ? (
              <div className="loading-container">
                <div className="spinner-border" style={{ color: "var(--color-gold)" }}></div>
              </div>
            ) : !activeOrder || activeOrder.items.length === 0 ? (
              <div className="review-card text-center">
                <p style={{ color: "var(--color-text-muted)" }}>Your cart is empty.</p>
                <a href="/menu/main" className="btn btn-outline-gold btn-sm">Browse Menu</a>
              </div>
            ) : (
              <div className="review-card mb-4">
                {activeOrder.items.map((orderItem) => (
                  <div
                    key={orderItem._id}
                    className="d-flex justify-content-between align-items-center py-2"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      {orderItem.menuItem?.image && (
                        <img
                          src={orderItem.menuItem.image}
                          alt={orderItem.menuItem?.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      )}
                      <div>
                        <strong style={{ color: "var(--color-cream)" }}>
                          {orderItem.menuItem?.name || "Item"}
                        </strong>
                        <div style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                          ${orderItem.price.toFixed(2)} each
                        </div>
                        {orderItem.specialInstructions && (
                          <div style={{ fontSize: "0.78rem", color: "var(--color-gold)", fontStyle: "italic" }}>
                            Note: {orderItem.specialInstructions}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-gold"
                        style={{ padding: "0.1rem 0.5rem" }}
                        onClick={() => handleUpdateQuantity(orderItem._id, orderItem.quantity - 1)}
                        disabled={orderItem.quantity <= 1}
                      >
                        −
                      </button>
                      <span style={{ minWidth: "24px", textAlign: "center" }}>{orderItem.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-gold"
                        style={{ padding: "0.1rem 0.5rem" }}
                        onClick={() => handleUpdateQuantity(orderItem._id, orderItem.quantity + 1)}
                      >
                        +
                      </button>
                      <span style={{ minWidth: "60px", textAlign: "right", color: "var(--color-gold)", fontWeight: 700 }}>
                        ${(orderItem.price * orderItem.quantity).toFixed(2)}
                      </span>
                      <button
                        className="btn btn-sm"
                        style={{ color: "var(--color-danger)", fontSize: "1.1rem", padding: "0 0.4rem" }}
                        onClick={() => handleRemoveItem(orderItem._id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-2" style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}>
                  <strong style={{ color: "var(--color-cream)", fontSize: "1.1rem" }}>Total</strong>
                  <strong style={{ color: "var(--color-gold)", fontSize: "1.2rem" }}>
                    ${activeOrder.totalPrice.toFixed(2)}
                  </strong>
                </div>
                <button className="btn btn-gold w-100 mt-3" onClick={handleSubmitOrder}>
                  Submit Order
                </button>
              </div>
            )}

            {/* Past Orders */}
            {pastOrders.length > 0 && (
              <>
                <h5 className="mt-4" style={{ color: "var(--color-cream)", fontFamily: "var(--font-display)" }}>
                  Order History
                </h5>
                {pastOrders.map((order) => (
                  <div className="review-card" key={order._id}>
                    <div className="d-flex justify-content-between">
                      <small style={{ color: "var(--color-text-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString()} — {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </small>
                      <span className="badge" style={{ background: "var(--color-success)", fontSize: "0.72rem" }}>
                        {order.status}
                      </span>
                    </div>
                    <strong style={{ color: "var(--color-gold)" }}>
                      ${order.totalPrice.toFixed(2)}
                    </strong>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
