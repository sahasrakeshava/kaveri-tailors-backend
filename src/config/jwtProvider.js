const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Generate an Access Token (JWT) with 48 hours expiration
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "48h" });
  return token;
};

// Generate a Refresh Token with 7 days expiration
const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  return refreshToken;
};

const getUserIdFromToken = (token) => {
  const decodedToken = jwt.verify(token, SECRET_KEY);
  return decodedToken.userId;
};

module.exports = { generateToken, generateRefreshToken, getUserIdFromToken };
