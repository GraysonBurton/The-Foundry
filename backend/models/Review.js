const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    adminResponse: { type: String, default: "" },
  },
  { timestamps: true }
);

// One review per user per menu item
reviewSchema.index({ menuItem: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
