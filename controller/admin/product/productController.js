const Product = require("../../../model/productModel")

exports.createProduct = async (req, res) => {
  const file = req.file
  let filePath
  if (!file) {
    filePath = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Momo_nepal.jpg/1280px-Momo_nepal.jpg"
  } else {
    filePath = file.filename
  }

  const { productName, productDescription, productPrice, productStatus, productStockQty } = req.body

  if (!productName || !productDescription || !productPrice || !productStatus || !productStockQty) {
    return res.status(400).json({
      message: "Please provide productName, productDescription, productPrice, productStatus, productStockQty"
    })
  }

  await Product.create({
    productName,
    productDescription,
    productPrice,
    productStatus,
    productStockQty,
    productImage: "http://localhost:8000/" + filePath
  })

  res.status(200).json({
    message: "Product Created Successfully"
  })

}

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  if (products.length == 0) {
    res.status(400).json({
      message: "No product found",
      products: []
    })
  } else {
    res.status(200).json({
      status: "success",
      products,
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
  if (product.length == 0) {
    res.status(400).json({
      message: "No product found"
    })
  } else {
    res.status(200).json({
      status: "success",
      product,
      message: "Product fetched sucessfully"
    })
  }
}