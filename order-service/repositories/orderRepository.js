// ============================================
// REPOSITORY LAYER (Data Access Layer)
// Handles all MongoDB operations for Order.
// ============================================

const Order = require("../models/orderModel");

// Returns ALL orders from MongoDB
const findAll = async () => {
  return await Order.find();
};

// Finds a single order by MongoDB _id
const findById = async (id) => {
  return await Order.findById(id);
};

// Saves a new order to MongoDB
const save = async (orderData) => {
  const newOrder = new Order({
    userId: orderData.userId,
    productId: orderData.productId,
    quantity: orderData.quantity,
    totalPrice: orderData.totalPrice,
    status: orderData.status || "confirmed",
  });
  return await newOrder.save();
};

module.exports = { findAll, findById, save };
