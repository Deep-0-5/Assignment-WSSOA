// ============================================
// PRODUCT SERVICE - Entry Point
// Independently runnable microservice for
// managing Product resources.
// Port: 3002
// ============================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productController = require("./controllers/productController");

const app = express();
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/productdb";

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
    service: "Product Service",
    message: "Product Service is running",
    endpoints: {
      products: "/products",
    },
  });
});

// Connect product controller to /products route
app.use("/products", productController);

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
    console.log("  Product Service - MongoDB connected!");
    console.log("===========================================");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("\n===========================================");
      console.log("  Product Service is running!");
      console.log("  Server:   http://localhost:" + PORT);
      console.log("  Products: http://localhost:" + PORT + "/products");
      console.log("===========================================\n");
    });
  })
  .catch((err) => {
    console.error("Product Service - MongoDB connection failed:", err.message);
    process.exit(1);
  });
