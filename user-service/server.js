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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/userdb";

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
