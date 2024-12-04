const express = require("express");
const router = express.Router();

const cartItemControlller = require("../controller/cartItem.controller.js");
const authenticate = require("../middleware/authenticate.js");

router.put("/:id", authenticate, cartItemControlller.updateCartItem);
router.delete("/:id", authenticate, cartItemControlller.removeCartItem);

module.exports = router;
