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