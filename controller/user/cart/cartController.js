const User = require("../../../model/userModel");
const Product = require("../../../model/productModel")


exports.addToCart = async (req, res) => {
  // userId, productId
  const userId = req.user.id;
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({
      message: "Please provide productId"
    })
  }
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return res.status(404).json({
      message: "No product with that productId"
    })
  }
  const user = await User.findById(userId)
  user.cart.push(productId);
  await user.save();
  res.status(200).json({
    message: "Product added to cart"
  })
}

exports.getMyCartItems = async (req, res) => {
  const userId = req.user.id;
  const { cart: cartItems } = await User.findById(userId).populate({
    path: "cart",
    select: "-productStatus"
  })
  if (!cartItems) {
    res.status(404).json({
      message: 'No items in cart'
    })
  } else {
    res.status(200).json({
      message: "succes",
      data: cartItems
    })
  }
}

exports.deleteCartItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  if (!productId) {
    return res.status(400).json({
      message: "please provide Product productId",
    })
  }

  const product = await Product.findById(productId)

  if (!product) {
    return res.status(400).json({
      message: "Product with that productId not found",
    })
  }

  const userData = await User.findById(userId)

  userData.cart = userData.cart.filter(product => product != productId)
  await userData.save();
  res.status(203).json({
    mesage: "Product deleted sucessfully",
    data: userData.cart
  })

}