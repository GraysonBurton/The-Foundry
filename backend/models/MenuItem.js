const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "appetizer",
        "main-course",
        "beverage",
        "dessert",
        "side",
      ],
    },
    image: { type: String, default: "" },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    dietaryTags: [
      {
        type: String,
        enum: [
          "vegetarian",
          "vegan",
          "gluten-free",
          "dairy-free",
          "nut-free",
          "spicy",
        ],
      },
    ],
    isAvailable: { type: Boolean, default: true },
    isSpecial: { type: Boolean, default: false },
    prepTime: { type: Number, default: 15 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
