const { searchProducts } = require("../services/search.Service");
const Category = require("../models/category.model"); // Adjust the path to your Category model

const handleSearch = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Build filters
    const filters = {};

    // Handle category
    if (category) {
      const existCategory = await Category.findOne({ name: category });
      if (existCategory) {
        filters.category = existCategory._id; // Use ObjectId for filtering
      } else {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    // Handle price range
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const products = await searchProducts(query, filters);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleSearch,
};
