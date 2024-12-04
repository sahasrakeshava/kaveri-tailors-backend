const ratingService = require("../services/rating.service.js");

const createRating = async (res, req) => {
  const user = req.user;
  try {
    const review = await ratingService.createRatin(req.body, user);
    return res.status(201).send(review);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllRatings = async (res, req) => {
  const user = req.user;
  const productId = req.params.productId;
  try {
    const reviews = await ratingService.getAllRatings(productId);
    return res.status(201).send(reviews);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createRating,
  getAllRatings,
};
