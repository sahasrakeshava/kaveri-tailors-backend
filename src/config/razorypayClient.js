// Import the dotenv package to load environment variables
require("dotenv").config();
const Razorpay = require("razorpay");

// Use environment variables for API keys
const apikey = process.env.RAZORPAY_API_KEY;
const apiSecret = process.env.RAZORPAY_API_SECRET;

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: apikey,
  key_secret: apiSecret,
});

module.exports = razorpay;
