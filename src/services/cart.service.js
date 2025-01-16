const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");

async function createCart(user) {
  try {
    const cart = new Cart({ user });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}
const mongoose = require("mongoose");

async function findUserCart(userId) {
  try {
    console.log(userId);

    let cart = await Cart.findOne({ user: userId });

    // Check if the cart exists, if not, create a new one
    if (!cart) {
      cart = await createCart(objectId);
    }

    // Find items in the cart
    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    cart.cartItems = cartItems;

    // Initialize total price variables
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    // Calculate totals
    for (let cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    }

    // Update cart with calculated totals, including totalDiscountedPrice
    cart.totalPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.discounte = totalPrice - totalDiscountedPrice;

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function addCartItem(userId, req) {
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({ user: userId, cartItems: [] });
      await cart.save();
    }

    const product = await Product.findById(req.productId);
    if (!product) {
      throw new console.error("Product not found");
    }

    const isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userID: userId, // Ensure you use userID
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userID: userId, // Ensure you use userID
        price: product.price,
        size: req.size,
        title: req.title,
        discountedPrice: product.discountedPrice,
      });
      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
      await cart.save();
      return createdCartItem;
    }
    return isPresent;
  } catch (error) {
    throw new console.error(error.message);
  }
}

module.exports = { createCart, findUserCart, addCartItem };
