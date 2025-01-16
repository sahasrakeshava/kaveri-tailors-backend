const jwtProvider = require("../config/jwtProvider.js");
const userService = require("../services/user.service.js");

const authenticate = async (req, res, next) => {
  try {
    // Check if Passport has authenticated the user (e.g., via Google OAuth2)
    if (req.isAuthenticated && req.isAuthenticated()) {
      console.log("Authenticated via Google OAuth:", req.user);
      req.user = req.user; // Attach the Passport-authenticated user to the request
      return next();
    }

    // If not authenticated by Passport, check for JWT
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token:", req.headers.authorization);
    if (!token) {
      return res.status(401).send({ error: "Token not found" });
    }

    const userId = jwtProvider.getUserIdFromToken(token);
    if (!userId) {
      return res.status(401).send({ error: "Invalid token" });
    }

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    req.user = user; // Attach the user to the request object
    console.log("Authenticated user:", userId);
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("Error in authentication middleware:", error);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = authenticate;
