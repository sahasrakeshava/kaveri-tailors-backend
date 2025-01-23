const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow requests from localhost:3000
  methods: "*", // Allow all methods (GET, POST, PUT, DELETE, etc.)
  credentials: true, // Allow cookies and credentials (if needed)
};
app.use(cors(corsOptions));

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a secure secret in production
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth2 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://api-kt-bcf1/api/users/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Pass the Google profile to Passport
        return done(null, profile);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Add state parameter to Google OAuth flow
GoogleStrategy.prototype.authorizationParams = function (options) {
  return { state: "kaveri-tailors" };
};

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Sample route to verify server
app.get("/", (req, res) => {
  return res.status(200).send({ message: "Sahasra", status: true });
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.log("Error logging out: ", err);
      return next(err); // Pass the error to the error-handling middleware
    }
    console.log("Logged out successfully");
    req.session.destroy(); // Clean up session
    res.send("Goodbye..");
  });
});

// Import and use route modules
const authRouters = require("./routes/auth.route.js");
app.use("/auth", authRouters);

const searchRouters = require("./routes/search.routes");
app.use("/api", searchRouters);

const userRouters = require("./routes/user.route.js");
app.use("/api/users", userRouters); // Includes Google OAuth routes

const productRouter = require("./routes/product.routes.js");
app.use("/api/products", productRouter);

const adminProductRouter = require("./routes/adminProduct.routes.js");
app.use("/api/admin/products", adminProductRouter);

const cartRouter = require("./routes/cart.route.js");
app.use("/api/cart", cartRouter);

const cartItemRouter = require("./routes/cartItem.routes.js");
app.use("/api/cart_items", cartItemRouter);

const orderRouter = require("./routes/order.routes.js");
app.use("/api/orders", orderRouter);

const reviewRouter = require("./routes/review.routes.js");
app.use("/api/reviews", reviewRouter);

const adminOrderRouter = require("./routes/adminOrder.routes.js");
app.use("/api/admin/orders", adminOrderRouter);

const paymentRouter = require("./routes/payment.routes.js");
app.use("/api/payments", paymentRouter);

module.exports = app; // Export the app for use in server.js
