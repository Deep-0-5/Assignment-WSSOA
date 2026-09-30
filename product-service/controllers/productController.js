// ============================================
// CONTROLLER LAYER (Routes / Request Handler)
// Takes HTTP requests, calls the Service,
// and sends back HTTP responses (JSON + status).
// ============================================

const express = require("express");
const router = express.Router();
const productService = require("../services/productService");

// -----------------------------------------------
// GET /products - Get all products
// -----------------------------------------------
router.get("/", async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
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
// GET /products/:id - Get a single product by ID
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
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
// POST /products - Create a new product
// -----------------------------------------------
router.post("/", async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
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
// PUT /products/:id - Update an existing product
// -----------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
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
// DELETE /products/:id - Delete a product
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
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
