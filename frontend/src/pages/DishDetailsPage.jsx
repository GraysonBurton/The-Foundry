import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StarRating({ rating, onRate, interactive = false }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          style={{
            cursor: interactive ? "pointer" : "default",
            fontSize: "1.2rem",
          }}
          className={star <= rating ? "star-filled" : "star-empty"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function DishDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API, user } = useAuth();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review form
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit review
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([API.get(`/menu/${id}`), API.get(`/reviews/${id}`)])
      .then(([itemRes, reviewRes]) => {
        setItem(itemRes.data);
        setReviews(reviewRes.data);
      })
      .catch(() => setError("Failed to load dish details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    try {
      await API.post("/orders/add-item", { menuItemId: id, quantity: 1 });
      alert("Added to your order!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to order");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newRating || !newComment.trim()) {
      setReviewError("Please provide a rating and comment.");
      return;
    }
    setSubmitting(true);
    setReviewError("");
    try {
      const res = await API.post("/reviews", {
        menuItem: id,
        rating: newRating,
        comment: newComment,
      });
      setReviews([res.data, ...reviews]);
      setNewRating(0);
      setNewComment("");
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    }
    setSubmitting(false);
  };

  const handleEditReview = async (reviewId) => {
    try {
      const res = await API.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
      });
      setReviews(reviews.map((r) => (r._id === reviewId ? res.data : r)));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (loading) {
    return (
      <div className="page-content loading-container">
        <div className="spinner-border" style={{ color: "var(--color-gold)" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-content d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2>Dish Not Found</h2>
          <p style={{ color: "var(--color-text-muted)" }}>{error || "This item does not exist."}</p>
          <button className="btn btn-gold" onClick={() => navigate("/menu/main")}>Back to Menu</button>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "No ratings";

  return (
    <div className="page-content">
      <section className="section-dark" style={{ paddingTop: "2rem" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          <button
            className="btn btn-outline-gold btn-sm mb-4"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="row g-4">
            {/* Image */}
            <div className="col-md-6">
              <img
                src={item.image}
                alt={item.name}
                className="img-fluid"
                style={{ borderRadius: "4px", width: "100%", maxHeight: "400px", objectFit: "cover" }}
              />
            </div>

            {/* Details */}
            <div className="col-md-6">
              <div className="d-flex gap-2 mb-2">
                {item.dietaryTags?.map((tag) => (
                  <span key={tag} className={`dietary-tag tag-${tag}`}>{tag}</span>
                ))}
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", color: "var(--color-cream)", marginBottom: "0.5rem" }}>
                {item.name}
              </h1>
              <p style={{ color: "var(--color-gold)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                ${item.price.toFixed(2)}
              </p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                {avgRating !== "No ratings" && <><StarRating rating={Math.round(parseFloat(avgRating))} /> {avgRating} · </>}
                {reviews.length} review{reviews.length !== 1 ? "s" : ""} · {item.prepTime} min prep
              </p>
              <p style={{ lineHeight: "1.8", color: "var(--color-text)" }}>{item.description}</p>

              {item.ingredients?.length > 0 && (
                <div className="mb-3">
                  <strong style={{ color: "var(--color-cream)", fontSize: "0.85rem", textTransform: "uppercase" }}>
                    Ingredients
                  </strong>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                    {item.ingredients.join(" · ")}
                  </p>
                </div>
              )}

              {item.allergens?.length > 0 && (
                <div className="mb-3">
                  <strong style={{ color: "#c0392b", fontSize: "0.85rem", textTransform: "uppercase" }}>
                    Allergens
                  </strong>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                    {item.allergens.join(", ")}
                  </p>
                </div>
              )}

              <button
                className="btn btn-gold w-100 mt-2"
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
              >
                {item.isAvailable ? "Add to Order" : "Currently Unavailable"}
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-5">
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--color-cream)" }}>
              Customer Reviews
            </h3>
            <div className="gold-divider" style={{ margin: "0.8rem 0 1.5rem" }}></div>

            {/* Write Review Form */}
            {user && (
              <div className="review-card mb-4">
                <h5 style={{ color: "var(--color-cream)", fontSize: "0.95rem" }}>Write a Review</h5>
                <div className="mb-2">
                  <StarRating rating={newRating} onRate={setNewRating} interactive />
                </div>
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  placeholder="Share your experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "var(--color-text)",
                  }}
                />
                {reviewError && <p style={{ color: "var(--color-danger)", fontSize: "0.85rem" }}>{reviewError}</p>}
                <button
                  className="btn btn-gold btn-sm"
                  onClick={handleSubmitReview}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}

            {!user && (
              <p style={{ color: "var(--color-text-muted)" }}>
                <a href="/login" style={{ color: "var(--color-gold)" }}>Sign in</a> to leave a review.
              </p>
            )}

            {/* Review List */}
            {reviews.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>No reviews yet. Be the first!</p>
            ) : (
              reviews.map((review) => (
                <div className="review-card" key={review._id}>
                  {editingId === review._id ? (
                    <>
                      <StarRating rating={editRating} onRate={setEditRating} interactive />
                      <textarea
                        className="form-control my-2"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        style={{
                          background: "var(--color-bg)",
                          border: "1px solid rgba(201,168,76,0.2)",
                          color: "var(--color-text)",
                        }}
                      />
                      <button className="btn btn-gold btn-sm me-2" onClick={() => handleEditReview(review._id)}>
                        Save
                      </button>
                      <button className="btn btn-outline-gold btn-sm" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong style={{ color: "var(--color-cream)" }}>
                            {review.user?.firstName} {review.user?.lastName}
                          </strong>
                          <div><StarRating rating={review.rating} /></div>
                        </div>
                        <small style={{ color: "var(--color-text-muted)" }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mt-2 mb-1" style={{ color: "var(--color-text)" }}>
                        {review.comment}
                      </p>
                      {review.adminResponse && (
                        <div
                          className="mt-2 p-2"
                          style={{
                            background: "rgba(201,168,76,0.08)",
                            border: "1px solid rgba(201,168,76,0.15)",
                            borderRadius: "4px",
                          }}
                        >
                          <small style={{ color: "var(--color-gold)" }}>
                            <strong>Manager Response:</strong>
                          </small>
                          <p className="mb-0 mt-1" style={{ fontSize: "0.88rem", color: "var(--color-text)" }}>
                            {review.adminResponse}
                          </p>
                        </div>
                      )}
                      {/* Edit / Delete buttons */}
                      {user && (user._id === review.user?._id || user.role === "admin") && (
                        <div className="mt-2 d-flex gap-2">
                          {user._id === review.user?._id && (
                            <button
                              className="btn btn-outline-gold btn-sm"
                              style={{ fontSize: "0.75rem" }}
                              onClick={() => {
                                setEditingId(review._id);
                                setEditRating(review.rating);
                                setEditComment(review.comment);
                              }}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            className="btn btn-sm"
                            style={{ fontSize: "0.75rem", color: "var(--color-danger)", border: "1px solid var(--color-danger)" }}
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
