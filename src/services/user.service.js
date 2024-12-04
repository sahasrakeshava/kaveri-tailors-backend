const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwtProvider = require("../config/jwtProvider.js");
const Address = require("../models/address.model.js"); // Import the Address model

const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password } = userData;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new Error("User already exsists with email:", email);
    }
    password = await bcrypt.hash(password, 8);

    const user = await User.create({ firstName, lastName, email, password });

    console.log("created user", user);

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    //.populate("address");
    if (!user) {
      throw new Error("user not Found with user id :", userId);
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user not Found with email :", email);
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserProfileByToken = async (token) => {
  try {
    const userId = jwtProvider.getUserIdFromToken(token);

    // Get user data
    const user = await findUserById(userId);
    if (!user) {
      throw new Error("User not found with user id: " + userId);
    }

    // If there are no addresses or they have been deleted, set address to an empty array
    if (!user.address || user.address.length === 0) {
      user.address = []; // Ensure address field is empty if no addresses exist
    } else {
      const addresses = await Address.find({ _id: { $in: user.address } });
      user.address = addresses; // Replace the address ids with actual address data
    }

    console.log("User profile with addresses:", user);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  createUser,
  findUserById,
  getUserByEmail,
  getUserProfileByToken,
  getAllUsers,
};
