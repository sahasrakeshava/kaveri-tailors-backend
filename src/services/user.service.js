const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwtProvider = require("../config/jwtProvider.js");
const Address = require("../models/address.model.js"); // Import the Address model

const createUser = async (userData) => {
  try {
    let { firstName, lastName, email, password } = userData;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      throw new Error("User already exists with email:", email);
    }
    password = await bcrypt.hash(password, 10);

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
    if (!user) {
      throw new Error("User not found with user ID:", userId);
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
      throw new Error("User not found with email");
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
      throw new Error("User not found with user ID: " + userId);
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

// New method to handle Google OAuth2 users
const findOrCreateGoogleUser = async (googleProfile) => {
  try {
    const {
      id: googleId,
      given_name: firstName,
      family_name: lastName,
      email,
    } = googleProfile;

    // Check if the user exists based on googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // If the user does not exist, create a new user
      user = new User({
        googleId,
        firstName,
        lastName,
        email,
        role: "CUSTOMER", // Default role
      });
      await user.save();
      console.log("New Google user created:", user);
    } else {
      console.log("Existing Google user found:", user);
    }

    return user;
  } catch (error) {
    throw new Error("Error finding or creating Google user: " + error.message);
  }
};

module.exports = {
  createUser,
  findUserById,
  getUserByEmail,
  getUserProfileByToken,
  getAllUsers,
  findOrCreateGoogleUser, // Export the new method
};
