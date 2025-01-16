const cartService = require("../services/cart.service.js");

const findUserCart = async (req, res) => {
  const user = req.params.user;
  console.log("req.user:", req.params.user); // Log the user object
  try {
    const cart = await cartService.findUserCart(user);
    console.log(cart);
    return res.status(200).send(cart);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  const user = req.body.user;
  console.log("User ID:", user); // Log the user ID
  console.log("Request Body:", req.body); // Log the request body

  try {
    const cartItem = await cartService.addCartItem(user, req.body);
    return res.status(200).send(cartItem);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  findUserCart,
  addItemToCart,
};
