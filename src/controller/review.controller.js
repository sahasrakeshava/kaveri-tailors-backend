const reviewService = require("../services/review.service.js");

const createReview = async (req, res) => {
  const { productId, review, rating, user } = req.body;
  try {
    const reviewData = {
      productId,
      review,
      rating,
      user,
    };
    const createdReview = await reviewService.createReview(reviewData);
    return res.status(201).send(createdReview);
  } catch (error) {
    console.log("error creating review:", error.message);
    return res.status(500).send({ error: error.message });
  }
};

const getAllReview = async (req, res) => {
  const productId = req.params.productId;
  console.log("productId:", productId);
  try {
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
