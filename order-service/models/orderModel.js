// ============================================
// ORDER MODEL (Mongoose Schema)
// Defines the shape of an Order document
// stored in MongoDB.
// ============================================

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true,
    },
    productId: {
      type: String,
      required: [true, "Product ID is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      default: "confirmed",
      enum: ["pending", "confirmed", "cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
