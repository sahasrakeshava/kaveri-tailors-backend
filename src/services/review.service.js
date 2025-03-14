const Review = require("../models/review.model.js");
const productService = require("../services/product.service.js");

async function createReview(reqData) {
  const product = await productService.findProductById(reqData.productId);

  const review = new Review({
    product: product._id,
    review: reqData.review,
    rating: reqData.rating,
    user: reqData.user || "675854deca75b7b748d39d12",
    createdAt: new Date(),
  });

  await product.save();
  return await review.save();
}

async function getAllReview(productId) {
  console.log("product Id:", productId);

  const product = await productService.findProductById(productId);
  console.log("product:", product);
  return await Review.find({ product: productId }).populate("user");
}
module.exports = {
  createReview,
  getAllReview,
};
