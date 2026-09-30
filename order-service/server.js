// ============================================
// ORDER SERVICE - Entry Point
// Independently runnable microservice for
// managing Order resources.
// Port: 3003
// ============================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderController = require("./controllers/orderController");

const app = express();
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/orderdb";

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Health check / welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Order Service",
    message: "Order Service is running",
    dependencies: {
      userServiceUrl: process.env.USER_SERVICE_URL || "http://localhost:3001",
      productServiceUrl: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
    },
    endpoints: {
      orders: "/orders",
    },
  });
});

// Connect order controller to /orders route
app.use("/orders", orderController);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error("Unexpected Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ============================================
// CONNECT TO MONGODB, THEN START SERVER
// ============================================
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("\n===========================================");
    console.log("  Order Service - MongoDB connected!");
    console.log("===========================================");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("\n===========================================");
      console.log("  Order Service is running!");
      console.log("  Server:  http://localhost:" + PORT);
      console.log("  Orders:  http://localhost:" + PORT + "/orders");
      console.log("  User Service:    " + (process.env.USER_SERVICE_URL || "http://localhost:3001"));
      console.log("  Product Service: " + (process.env.PRODUCT_SERVICE_URL || "http://localhost:3002"));
      console.log("===========================================\n");
    });
  })
  .catch((err) => {
    console.error("Order Service - MongoDB connection failed:", err.message);
    process.exit(1);
  });
