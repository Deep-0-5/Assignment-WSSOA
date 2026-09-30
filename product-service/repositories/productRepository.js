// ============================================
// REPOSITORY LAYER (Data Access Layer)
// Handles all MongoDB operations for Product.
// ============================================

const Product = require("../models/productModel");

// Returns ALL products from MongoDB
const findAll = async () => {
  return await Product.find();
};

// Finds a single product by MongoDB _id
const findById = async (id) => {
  return await Product.findById(id);
};

// Saves a new product to MongoDB
const save = async (productData) => {
  const newProduct = new Product({
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
  });
  return await newProduct.save();
};

// Updates an existing product by MongoDB _id
const update = async (id, productData) => {
  return await Product.findByIdAndUpdate(
    id,
    {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
    },
    { new: true, runValidators: true }
  );
};

// Deletes a product by MongoDB _id
const remove = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = { findAll, findById, save, update, remove };
