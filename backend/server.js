const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./api/routes/authRoutes");
const menuRoutes = require("./api/routes/menuRoutes");
const reviewRoutes = require("./api/routes/reviewRoutes");
const reservationRoutes = require("./api/routes/reservationRoutes");
const orderRoutes = require("./api/routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "The Foundry API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler for unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`\n🔥 The Foundry Backend running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api\n`);
});
