// ============================================
// SERVICE LAYER (Business Logic)
// Handles validation and business rules
// before calling the Repository layer.
// ============================================

const productRepository = require("../repositories/productRepository");

// Get all products
const getAllProducts = async () => {
  return await productRepository.findAll();
};

// Get a single product by ID
const getProductById = async (id) => {
  let product;

  try {
    product = await productRepository.findById(id);
  } catch (err) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    throw error;
  }

  if (!product) {
    const error = new Error("Product with ID " + id + " not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// Create a new product
const createProduct = async (productData) => {
  const { name, description, price, category } = productData;

  // Validation: Check required fields
  if (!name || !description || price === undefined || price === null || !category) {
    const error = new Error("All fields are required: name, description, price, category");
    error.statusCode = 400;
    throw error;
  }

  // Validation: Price format
  if (typeof price !== "number" || price < 0) {
    const error = new Error("Price must be a positive number or zero");
    error.statusCode = 400;
    throw error;
  }

  return await productRepository.save(productData);
};

// Update an existing product
const updateProduct = async (id, productData) => {
  let existingProduct;
  try {
    existingProduct = await productRepository.findById(id);
  } catch (err) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    throw error;
  }

  if (!existingProduct) {
    const error = new Error("Product with ID " + id + " not found");
    error.statusCode = 404;
    throw error;
  }

  // Validation: If price is provided, must be >= 0
  if (productData.price !== undefined && productData.price !== null) {
    if (typeof productData.price !== "number" || productData.price < 0) {
      const error = new Error("Price must be a positive number or zero");
      error.statusCode = 400;
      throw error;
    }
  }

  return await productRepository.update(id, productData);
};

// Delete a product
const deleteProduct = async (id) => {
  let deletedProduct;

  try {
    deletedProduct = await productRepository.remove(id);
  } catch (err) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    throw error;
  }

  if (!deletedProduct) {
    const error = new Error("Product with ID " + id + " not found");
    error.statusCode = 404;
    throw error;
  }

  return deletedProduct;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
