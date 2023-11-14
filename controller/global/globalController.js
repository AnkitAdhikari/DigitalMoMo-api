const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");


exports.getProducts = async (req, res) => {
  // const products = await Product.find().populate({
  //   path: "reviews",
  //   populate: {
  //     path: "userId",
  //     select: "userName userEmail"
  //   }
  // });
  const products = await Product.find();
  if (products.length == 0) {
    res.status(400).json({
      message: "No product found",
      data: []
    })
  } else {
    res.status(200).json({
      status: "success",
      data: products,
      message: "product fetched sucessfully"
    })
  }
}

exports.getProduct = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      status: "failed",
      message: "Please provide id(productId)"
    })
  }

  const product = await Product.find({ _id: id });
  const productReviews = await Review.find({ productId: id }).populate("userId").populate("productId")
  if (product.length == 0) {
    res.status(400).json({
      message: "No product found",
      data: [],
    })
  } else {
    res.status(200).json({
      status: "success",
      data: { product, productReviews },
      message: "Product fetched sucessfully",
    })
  }
}