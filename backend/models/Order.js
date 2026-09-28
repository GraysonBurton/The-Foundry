const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  specialInstructions: { type: String, default: "" },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["active", "submitted", "preparing", "completed", "cancelled"],
      default: "active",
    },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Calculate total before saving
orderSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model("Order", orderSchema);
