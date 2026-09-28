const express = require("express");
const { body, validationResult } = require("express-validator");
const Order = require("../../models/Order");
const MenuItem = require("../../models/MenuItem");
const { authenticate, adminOnly } = require("../../middleware/auth");

const router = express.Router();

// GET /api/orders - Retrieve user's active cart/order
router.get("/", authenticate, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      filter.user = req.user._id;
    }

    const orders = await Order.find(filter)
      .populate("items.menuItem", "name image price category")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/orders/active - Get or create the user's active cart
router.get("/active", authenticate, async (req, res) => {
  try {
    let order = await Order.findOne({
      user: req.user._id,
      status: "active",
    }).populate("items.menuItem", "name image price category");

    if (!order) {
      order = await Order.create({ user: req.user._id, items: [] });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/orders/add-item - Add a dish to the order
router.post(
  "/add-item",
  authenticate,
  [
    body("menuItemId").notEmpty().withMessage("Menu item ID is required"),
    body("quantity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { menuItemId, quantity = 1, specialInstructions = "" } = req.body;

      // Verify menu item exists
      const menuItem = await MenuItem.findById(menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: "This item is currently unavailable" });
      }

      // Find or create active order
      let order = await Order.findOne({
        user: req.user._id,
        status: "active",
      });

      if (!order) {
        order = new Order({ user: req.user._id, items: [] });
      }

      // Check if item already in cart - if so, increase quantity
      const existingIndex = order.items.findIndex(
        (item) => item.menuItem.toString() === menuItemId
      );

      if (existingIndex > -1) {
        order.items[existingIndex].quantity += quantity;
        if (specialInstructions) {
          order.items[existingIndex].specialInstructions = specialInstructions;
        }
      } else {
        order.items.push({
          menuItem: menuItemId,
          quantity,
          specialInstructions,
          price: menuItem.price,
        });
      }

      await order.save();
      await order.populate("items.menuItem", "name image price category");
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// PUT /api/orders/update-item/:itemId - Update quantity or instructions
router.put("/update-item/:itemId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!order) {
      return res.status(404).json({ message: "No active order found" });
    }

    const itemIndex = order.items.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in order" });
    }

    if (req.body.quantity !== undefined) {
      order.items[itemIndex].quantity = req.body.quantity;
    }
    if (req.body.specialInstructions !== undefined) {
      order.items[itemIndex].specialInstructions = req.body.specialInstructions;
    }

    await order.save();
    await order.populate("items.menuItem", "name image price category");
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE /api/orders/remove-item/:itemId - Remove a dish from order
router.delete("/remove-item/:itemId", authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!order) {
      return res.status(404).json({ message: "No active order found" });
    }

    order.items = order.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await order.save();
    await order.populate("items.menuItem", "name image price category");
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// PUT /api/orders/:id/submit - Submit the order
router.put("/:id/submit", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.items.length === 0) {
      return res.status(400).json({ message: "Cannot submit an empty order" });
    }
    order.status = "submitted";
    await order.save();
    await order.populate("items.menuItem", "name image price category");
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;