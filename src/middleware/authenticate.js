const jwtProvider = require("../config/jwtProvider.js");
const userService = require("../services/user.service.js");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
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
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = authenticate;
