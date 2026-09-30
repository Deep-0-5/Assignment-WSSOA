// ============================================
// CONTROLLER LAYER (Routes / Request Handler)
// Takes HTTP requests, calls the Service,
// and sends back HTTP responses (JSON + status).
// ============================================

const express = require("express");
const router = express.Router();
const orderService = require("../services/orderService");

// -----------------------------------------------
// GET /orders - Get all orders
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
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
// GET /orders/:id - Get a single order by ID
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
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
// POST /orders - Create a new order (with User & Product validation)
// -----------------------------------------------
router.post("/", async (req, res) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result.order,
      referencedData: result.details,
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
