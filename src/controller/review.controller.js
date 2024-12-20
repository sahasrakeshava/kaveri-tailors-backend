const reviewService = require("../services/review.service.js");

const createReview = async (res, req) => {
  const user = req.user;
  try {
    const review = await reviewService.createReview(req.body, user);
    return res.status(201).send(review);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllReview = async (req, res) => {
  const user = req.user;
  const productId = req.params.productId;
  try {
    console.log("Fetching reviews for product:", productId);
    const reviews = await reviewService.getAllReview(productId);
    return res.status(201).send(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createReview,
  getAllReview,
};
