const express = require("express");
const { body, validationResult } = require("express-validator");
const MenuItem = require("../../models/MenuItem");
const { authenticate, adminOnly } = require("../../middleware/auth");

const router = express.Router();

// GET /api/menu - Retrieve all menu items (public)
router.get("/", async (req, res) => {
  try {
    const { category, dietary, available, special, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (available !== undefined) filter.isAvailable = available === "true";
    if (special === "true") filter.isSpecial = true;
    if (dietary) filter.dietaryTags = { $in: dietary.split(",") };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/menu/:id - Retrieve a single menu item (public)
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/menu - Add a new dish (Admin only)
router.post(
  "/",
  authenticate,
  adminOnly,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Valid price is required"),
    body("category").isIn([
      "appetizer",
      "main-course",
      "beverage",
      "dessert",
      "side",
    ]).withMessage("Valid category is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const item = await MenuItem.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// PUT /api/menu/:id - Update dish details (Admin only)
router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/menu/:id - Remove a dish (Admin only)
router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
