const express = require("express");
const { body, validationResult } = require("express-validator");
const Review = require("../../models/Review");
const { authenticate, adminOnly } = require("../../middleware/auth");

const router = express.Router();

// GET /api/reviews/:menuItemId - Retrieve reviews for a specific dish
router.get("/:menuItemId", async (req, res) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.menuItemId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/reviews - Add a review to a dish (User) or admin response
router.post(
  "/",
  authenticate,
  [
    body("menuItem").notEmpty().withMessage("Menu item ID is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").trim().notEmpty().withMessage("Comment is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check for existing review from this user for this item
      const existingReview = await Review.findOne({
        menuItem: req.body.menuItem,
        user: req.user._id,
      });
      if (existingReview) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this dish" });
      }

      const review = await Review.create({
        menuItem: req.body.menuItem,
        user: req.user._id,
        rating: req.body.rating,
        comment: req.body.comment,
      });

      const populated = await review.populate("user", "firstName lastName");
      res.status(201).json(populated);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// PUT /api/reviews/:id - Edit an existing review (owner or admin)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Admin can add adminResponse; users can edit their own review
    if (req.user.role === "admin") {
      if (req.body.adminResponse !== undefined) {
        review.adminResponse = req.body.adminResponse;
      }
    } else if (review.user.toString() === req.user._id.toString()) {
      if (req.body.rating) review.rating = req.body.rating;
      if (req.body.comment) review.comment = req.body.comment;
    } else {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    await review.save();
    const populated = await review.populate("user", "firstName lastName");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete a review (Admin moderation or owner)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only admin or the review owner can delete
    if (
      req.user.role !== "admin" &&
      review.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
