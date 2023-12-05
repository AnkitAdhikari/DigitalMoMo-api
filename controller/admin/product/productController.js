const fs = require('fs')
const Product = require("../../../model/productModel")

exports.createProduct = async (req, res) => {
  const file = req.file
  let filePath;
  let defaultImage = true;
  if (!file) {
    filePath = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Momo_nepal.jpg/1280px-Momo_nepal.jpg"
  } else {
    filePath = file.filename
    defaultImage = false;
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
    productImage: defaultImage ? filePath : process.env.BACKEND_URL + filePath
  })

  res.status(200).json({
    message: "Product Created Successfully"
  })

}



exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: "Failed",
      message: "Id must be provided"
    })
  }


  const deleteProduct = await Product.findByIdAndDelete(id);


  if (!deleteProduct) {
    return res.status(400).json({
      status: "Failed",
      message: "No product found with the requested id"
    })
  }

  const lengthToCut = process.env.BACKEND_URL.length;

  const pathAfterCut = deleteProduct.productImage.slice(lengthToCut);

  if (deleteProduct.productImage.startsWith(process.env.BACKEND_URL)) {
    fs.unlinkSync('./uploads' + pathAfterCut, err => {
      if (err) console.log("Error while file deletion", err);
      else console.log("File deleted sucessfully")
    })
  }

  res.status(200).json({
    status: "Success",
    message: "Product deleted successfully"
  })

}

exports.editProduct = async (req, res) => {
  const { id } = req.params;

  const { productName, productDescription, productPrice, productStatus, productStockQty } = req.body

  if (!productName || !productDescription || !productPrice || !productStatus || !productStockQty) {
    return res.status(400).json({
      message: "Please provide productName, productDescription, productPrice, productStatus, productStockQty"
    })
  }

  const oldData = await Product.findById(id)

  if (!oldData) {
    return res.status(400).json({
      message: "No data found with that id"
    })
  }

  const lengthToCut = process.env.BACKEND_URL.length;

  const pathAfterCut = oldData.productImage.slice(lengthToCut);


  if (req.file && req.file.filename && oldData.productImage.startsWith(process.env.BACKEND_URL)) {
    fs.unlinkSync('./uploads' + pathAfterCut, err => {
      if (err) console.log("Error while file deletion", err);
      else console.log("File deleted sucessfully")
    })
  }

  const updatedData = await Product.findByIdAndUpdate(id, {
    productName,
    productDescription,
    productPrice,
    productStatus,
    productStockQty,
    productImage: req.file && req.file.filename ? process.env.BACKEND_URL + '/' + req.file.filename : oldData.productImage
  }, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'Success',
    message: "Product updated sucessfully",
    data: updatedData
  })
}