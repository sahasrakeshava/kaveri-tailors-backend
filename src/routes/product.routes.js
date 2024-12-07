const express = require("express");
const router = express.Router();

const productController = require("../controller/product.controller.js");

router.get("/", productController.getAllProducts);
router.get("/id/:id", productController.findProductById);

module.exports = router;
