const Review = require("../models/review.model.js");
const productService = require("../services/product.service.js");

async function createReview(reqData) {
  const product = await productService.findProductById(reqData.productId);

  const review = new Review({
    product: product._id,
    review: reqData.review,
    user: reqData.user,
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
