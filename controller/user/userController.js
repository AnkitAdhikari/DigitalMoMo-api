const Product = require("../../model/productModel");
const Review = require("../../model/reviewModel");



exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { rating, message } = req.body;
  const productId = req.params.id
  if (!rating || !message || !productId) {
    return res.status(400).json({
      message: "Please provide rating,message,productId"
    })
  }

  // check if that productId product exists or not
  const productExist = await Product.findById(productId)
  if (!productExist) {
    return res.status(404).json({
      status: "failed",
      message: "product not found"
    })
  }

  // insert them into review
  await Review.create({
    userId,
    productId,
    rating,
    message
  })

  res.status(200).json({
    status: "success",
    message: "Review added sucessfully"
  })
}

exports.getProductReview = async (req, res) => {
  const productId = req.params.id
  if (!productId) {
    return res.status(404).json({
      status: 'failed',
      message: "Please provide productId"
    })
  }
  const productExists = await Product.findById(productId)
  if (!productExists) {
    return res.status(404).json({
      message: "Product with that id doesn't exist"
    })
  }
  const reviews = await Review.find({ productId }).populate('userId');

  res.status(200).json({
    message: "review fetched sucessfully",
    data: reviews
  })

}


exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  if (!reviewId) {
    res.status(400).json({
      message: "Please provide reviewid"
    })
  }
  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({
    message: "Review delete sucessfully"
  })
}

exports.addProductReview = async (req, res) => {
  const productId = req.params.id
  const { rating, message } = req.body
  const userId = req.user.id
  const review = {
    userId,
    rating,
    message
  }
  const product = await Product.findById(productId)
  product.reviews.push(review)
  await product.save()
  res.json({
    message: "Review Done"
  })
}