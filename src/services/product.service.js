const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function createProduct(reqData) {
  let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

  if (!topLevel) {
    topLevel = new Category({
      name: reqData.topLevelCategory,
      level: 1,
    });
    await topLevel.save();
  }

  let secondLevel = await Category.findOne({
    name: reqData.secondLevelCategory,
    parentCategory: topLevel._id,
  });
  if (!secondLevel) {
    secondLevel = new Category({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
      level: 2,
    });
    await secondLevel.save();
  }

  let thirdLevel = await Category.findOne({
    name: reqData.thirdLevelCategory,
    parentCategory: secondLevel._id,
  });
  if (!thirdLevel) {
    thirdLevel = new Category({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    });
    await thirdLevel.save();
  }

  // Calculate `discountedPersent` if not provided
  const { price, discountedPrice } = reqData;
  let discountedPersent = reqData.discountedPersent;

  if (!discountedPersent && price && discountedPrice) {
    discountedPersent = ((price - discountedPrice) / price) * 100;
  }

  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice,
    discountedPersent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price,
    sizes: reqData.sizes,
    quantity: reqData.quantity,
    category: thirdLevel._id,
  });

  return await product.save();
}

async function deleteProduct(productId) {
  await Product.findByIdAndDelete(productId);
}
async function updateProduct(productId, reqData) {
  return await Product.findByIdAndUpdate(productId, reqData);
}
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id" + id);
  }
  return product;
}
async function getAllProducts(reqQuery) {
  let {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber = 1, // Default to 1 if undefined
    pageSize = 10, // Default to 10 if undefined
  } = reqQuery;

  let query = Product.find().populate("category");

  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory) {
      query = query.where("category").equals(existCategory._id);
    } else {
      return {
        content: [],
        currentPage: 1,
        totalPages: 0,
      };
    }
  }

  if (color) {
    const colorSet = new Set(
      color.split(",").map((c) => c.trim().toLowerCase())
    );
    const colorRegex =
      colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    if (colorRegex) query = query.where("color").regex(colorRegex);
  }

  if (sizes && sizes.length > 0) {
    const sizesSet = Array.isArray(sizes)
      ? new Set(sizes)
      : new Set(sizes.split(","));
    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
    query = query.where("discountedPersent").gt(minDiscount);
  }
  if (stock) {
    if (stock == "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock == "out_of_stock") {
      query = query.where("quantity").gt(1);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / pageSize);
  const skip = (Math.max(pageNumber, 1) - 1) * pageSize;

  const products = await query.skip(skip).limit(pageSize).exec();

  return { content: products, currentPage: pageNumber, totalPages };
}

async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
};
