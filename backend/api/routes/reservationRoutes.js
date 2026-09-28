const express = require("express");
const { body, validationResult } = require("express-validator");
const Reservation = require("../../models/Reservation");
const { authenticate, adminOnly } = require("../../middleware/auth");

const router = express.Router();

// GET /api/reservations - Retrieve user's reservations (or all for admin)
router.get("/", authenticate, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter.user = req.user._id;
    }

    const reservations = await Reservation.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ date: 1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/reservations/:id - Retrieve a single reservation
router.get("/:id", authenticate, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "user",
      "firstName lastName email"
    );
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Only owner or admin can view
    if (
      req.user.role !== "admin" &&
      reservation.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/reservations - Book a new reservation
router.post(
  "/",
  authenticate,
  [
    body("date").notEmpty().withMessage("Date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("partySize")
      .isInt({ min: 1, max: 20 })
      .withMessage("Party size must be between 1 and 20"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Validate date is not in the past
      const reservationDate = new Date(req.body.date);
      if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
        return res
          .status(400)
          .json({ message: "Cannot book a reservation in the past" });
      }

      const reservation = await Reservation.create({
        ...req.body,
        user: req.user._id,
      });

      res.status(201).json(reservation);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// PUT /api/reservations/:id - Update reservation (party size, time, etc.)
router.put("/:id", authenticate, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Only owner or admin can update
    if (
      req.user.role !== "admin" &&
      reservation.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/reservations/:id - Cancel a reservation
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Only owner or admin can cancel
    if (
      req.user.role !== "admin" &&
      reservation.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;