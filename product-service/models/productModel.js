// ============================================
// PRODUCT MODEL (Mongoose Schema)
// Defines the shape of a Product document
// stored in MongoDB.
// ============================================

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number or zero"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
