// ============================================
// SERVICE LAYER (Business Logic)
// Handles validation and business rules
// before calling the Repository layer.
// ============================================

const userRepository = require("../repositories/userRepository");

// Get all users
const getAllUsers = async () => {
  return await userRepository.findAll();
};

// Get a single user by ID
const getUserById = async (id) => {
  let user;

  try {
    user = await userRepository.findById(id);
  } catch (err) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    throw error;
  }

  if (!user) {
    const error = new Error("User with ID " + id + " not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Create a new user
const createUser = async (userData) => {
  const { name, email } = userData;

  // Validation: Check required fields
  if (!name || !email) {
    const error = new Error("All fields are required: name, email");
    error.statusCode = 400;
    throw error;
  }

  // Validation: Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error("Invalid email format");
    error.statusCode = 400;
    throw error;
  }

  try {
    return await userRepository.save(userData);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("A user with this email already exists");
      error.statusCode = 400;
      throw error;
    }
    throw err;
  }
};

// Update an existing user
const updateUser = async (id, userData) => {
  let existingUser;
  try {
    existingUser = await userRepository.findById(id);
  } catch (err) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    throw error;
  }

  if (!existingUser) {
    const error = new Error("User with ID " + id + " not found");
    error.statusCode = 404;
    throw error;
  }

  // Validation: If email is provided, check format
  if (userData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      const error = new Error("Invalid email format");
      error.statusCode = 400;
      throw error;
    }
  }

  try {
    return await userRepository.update(id, userData);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("A user with this email already exists");
      error.statusCode = 400;
      throw error;
    }
    throw err;
  }
};

// Delete a user
const deleteUser = async (id) => {
  let deletedUser;

  try {
    deletedUser = await userRepository.remove(id);
  } catch (err) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    throw error;
  }

  if (!deletedUser) {
    const error = new Error("User with ID " + id + " not found");
    error.statusCode = 404;
    throw error;
  }

  return deletedUser;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
