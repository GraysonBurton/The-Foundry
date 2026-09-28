const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../../models/User");
const { authenticate, generateToken } = require("../../middleware/auth");

const router = express.Router();

// POST /api/auth/signup - Register a new user
router.post(
  "/signup",
  [
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role: role || "user",
      });

      const token = generateToken(user._id);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// POST /api/auth/login - Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user._id);
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// GET /api/auth/profile - Get current user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
