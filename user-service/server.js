// ============================================
// USER SERVICE - Entry Point
// Independently runnable microservice for
// managing User resources.
// Port: 3001
// ============================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userController = require("./controllers/userController");

const app = express();
const PORT = process.env.PORT || 3001;
const DEFAULT_ATLAS_URI = "mongodb+srv://deepboghara6_db_user:k2g2wHxwZtQSzzdL@cluster0.6met6bi.mongodb.net/userdb?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || DEFAULT_ATLAS_URI;

console.log("\n===========================================");
console.log("  USER SERVICE v2.0 STARTING");
console.log("  Target DB:", MONGODB_URI.startsWith("mongodb+srv") ? "MongoDB Atlas Cluster" : MONGODB_URI);
console.log("===========================================\n");

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
    service: "User Service",
    message: "User Service is running",
    endpoints: {
      users: "/users",
    },
  });
});

// Connect user controller to /users route
app.use("/users", userController);

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
    console.log("  User Service - MongoDB connected!");
    console.log("===========================================");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("\n===========================================");
      console.log("  User Service is running!");
      console.log("  Server:  http://localhost:" + PORT);
      console.log("  Users:   http://localhost:" + PORT + "/users");
      console.log("===========================================\n");
    });
  })
  .catch((err) => {
    console.error("User Service - MongoDB connection failed:", err.message);
    process.exit(1);
  });
