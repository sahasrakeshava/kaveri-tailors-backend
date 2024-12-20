const express = require("express");
const router = express.Router();

const reviewController = require("../controller/review.controller.js");
const authenticate = require("../middleware/authenticate.js");

router.post("/create", reviewController.createReview);
router.get("/product/:productId", reviewController.getAllReview);

module.exports = router;
