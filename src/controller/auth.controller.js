const userService = require("../services/user.service.js");
const jwtProvider = require("../config/jwtProvider.js");
const bcrypt = require("bcryptjs");
const cartService = require("../services/cart.service.js");

const register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    const jwt = jwtProvider.generateToken(user._id);

    await cartService.createCart(user);

    return res.status(200).send({ jwt, message: "register success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found with email:", email });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password..." });
    }

    // Generate both access token (JWT) and refresh token
    const jwt = jwtProvider.generateToken(user._id);
    const refreshToken = jwtProvider.generateRefreshToken(user._id); // Generate refresh token

    // Send both tokens in the response body
    return res.status(200).send({
      jwt, // Access token
      refreshToken, // Refresh token
      message: "Login success",
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { register, login };
