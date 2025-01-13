const userService = require("../services/user.service.js");
const jwtProvider = require("../config/jwtProvider.js");

const getUserProfile = async (req, res) => {
  const jwt = req.headers.authorization?.split(" ")[1];
  console.log("req", jwt);
  try {
    if (!jwt) {
      return res.status(404).send({ error: "Token not found" });
    }
    const user = await userService.getUserProfileByToken(jwt);

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// New controller for Google OAuth2 callback
const handleGoogleCallback = async (req, res) => {
  try {
    // Step 1: Get the Google profile information (populated by Passport.js)
    const googleProfile = req.user;
    console.log("Google profile received:", googleProfile);

    // Step 2: Find or create the user using the Google profile
    const user = await userService.findOrCreateGoogleUser(googleProfile);

    // Step 3: Optionally generate a JWT for the authenticated user
    const token = jwtProvider.generateToken(user._id);

    // Step 4: Send the user and token back as the response
    const resData = { user, token };

    // Redirect to the frontend with the user data and token
    // For frontend to receive it, you can redirect to a URL like `localhost:3000?user=<user_data>&token=<jwt_token>`
    res.redirect(
      `http://localhost:3000?user=${encodeURIComponent(
        JSON.stringify(user)
      )}&token=${token}`
    );
  } catch (error) {
    // Step 5: Handle any errors that occur
    console.error("Error during Google authentication:", error);
    return res.status(500).send({
      error: "Google authentication failed: " + error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  getAllUsers,
  getUserById,
  handleGoogleCallback,
};
