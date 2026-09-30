// ============================================
// SERVICE LAYER (Business Logic & Orchestration)
// Handles validation and inter-service REST
// calls to User Service and Product Service.
// ============================================

const axios = require("axios");
const orderRepository = require("../repositories/orderRepository");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3001";
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:3002";
const HTTP_TIMEOUT_MS = 4000;

// Helper: validate and fetch user from User Service
const fetchUser = async (userId) => {
  try {
    const url = USER_SERVICE_URL + "/users/" + userId;
    const response = await axios.get(url, {
      timeout: HTTP_TIMEOUT_MS,
    });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404 || error.response.status === 400) {
        const err = new Error("User validation failed: User with ID '" + userId + "' not found");
        err.statusCode = 404;
        throw err;
      }
      const err = new Error("User Service returned error: " + (error.response.statusText || error.response.status));
      err.statusCode = 503;
      throw err;
    } else {
      const err = new Error("User Service is currently unavailable at " + USER_SERVICE_URL + ". Please try again later.");
      err.statusCode = 503;
      throw err;
    }
  }
};

// Helper: validate and fetch product from Product Service
const fetchProduct = async (productId) => {
  try {
    const url = PRODUCT_SERVICE_URL + "/products/" + productId;
    const response = await axios.get(url, {
      timeout: HTTP_TIMEOUT_MS,
    });
    return response.data.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404 || error.response.status === 400) {
        const err = new Error("Product validation failed: Product with ID '" + productId + "' not found");
        err.statusCode = 404;
        throw err;
      }
      const err = new Error("Product Service returned error: " + (error.response.statusText || error.response.status));
      err.statusCode = 503;
      throw err;
    } else {
      const err = new Error("Product Service is currently unavailable at " + PRODUCT_SERVICE_URL + ". Please try again later.");
      err.statusCode = 503;
      throw err;
    }
  }
};

// Get all orders
const getAllOrders = async () => {
  return await orderRepository.findAll();
};

// Get single order by ID
const getOrderById = async (id) => {
  let order;
  try {
    order = await orderRepository.findById(id);
  } catch (err) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    throw error;
  }

  if (!order) {
    const error = new Error("Order with ID " + id + " not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

// Create a new order with cross-service validation
const createOrder = async (orderData) => {
  const { userId, productId, quantity } = orderData;

  // Validation: Check required fields
  if (!userId || !productId || quantity === undefined || quantity === null) {
    const error = new Error("All fields are required: userId, productId, quantity");
    error.statusCode = 400;
    throw error;
  }

  // Validation: Quantity
  if (typeof quantity !== "number" || quantity <= 0) {
    const error = new Error("Quantity must be a positive integer greater than 0");
    error.statusCode = 400;
    throw error;
  }

  // 1. Validate User via User Service (Inter-service REST call)
  const user = await fetchUser(userId);

  // 2. Validate Product via Product Service (Inter-service REST call)
  const product = await fetchProduct(productId);

  // 3. Compute total price
  const totalPrice = product.price * quantity;

  // 4. Persist order in Order DB
  const savedOrder = await orderRepository.save({
    userId,
    productId,
    quantity,
    totalPrice,
    status: "confirmed",
  });

  return {
    order: savedOrder,
    details: {
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
      },
      product: {
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      },
    },
  };
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
};
