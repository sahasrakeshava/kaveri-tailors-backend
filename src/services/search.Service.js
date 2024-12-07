const Product = require("../models/product.model"); // Adjust the path as needed

/**
 * Searches for products based on a query and filters using full-text search.
 * @param {string} query - Search query for product titles.
 * @param {Object} filters - Filters for category, price, etc.
 * @returns {Array} - Array of matching products.
 */
const searchProducts = async (query, filters = {}) => {
  try {
    const products = await Product.find({
      ...filters,
      $text: { $search: query }, // Use the text search operator
    }).sort({ score: { $meta: "textScore" } }); // Sort by text score for relevance

    return products;
  } catch (error) {
    throw new Error("Error searching products: " + error.message);
  }
};

module.exports = {
  searchProducts,
};
