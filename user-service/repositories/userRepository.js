// ============================================
// REPOSITORY LAYER (Data Access Layer)
// Handles all MongoDB operations for User.
// All functions are async since DB operations
// return Promises.
// ============================================

const User = require("../models/userModel");

// Returns ALL users from MongoDB
const findAll = async () => {
  return await User.find();
};

// Finds a single user by MongoDB _id
const findById = async (id) => {
  return await User.findById(id);
};

// Saves a new user to MongoDB
const save = async (userData) => {
  const newUser = new User({
    name: userData.name,
    email: userData.email,
  });
  return await newUser.save();
};

// Updates an existing user by MongoDB _id
const update = async (id, userData) => {
  return await User.findByIdAndUpdate(
    id,
    {
      name: userData.name,
      email: userData.email,
    },
    { new: true, runValidators: true }
  );
};

// Deletes a user by MongoDB _id
const remove = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = { findAll, findById, save, update, remove };
