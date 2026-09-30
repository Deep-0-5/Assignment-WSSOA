// ============================================
// CONTROLLER LAYER (Routes / Request Handler)
// Takes HTTP requests, calls the Service,
// and sends back HTTP responses (JSON + status).
// ============================================

const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// -----------------------------------------------
// GET /users - Get all users
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// -----------------------------------------------
// GET /users/:id - Get a single user by ID
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
});

// -----------------------------------------------
// POST /users - Create a new user
// -----------------------------------------------
router.post("/", async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
});

// -----------------------------------------------
// PUT /users/:id - Update an existing user
// -----------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
});

// -----------------------------------------------
// DELETE /users/:id - Delete a user
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
