const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, "A product must have it's name"],
  },
  productDescription: {
    type: String,
    required: [true, "A product must have it's description"]
  },
  productStockQty: {
    type: Number,
    min: [0, "Product must have negetive quantity"],
    required: [true, "A product must have it's quantity"]
  },
  productPrice: {
    type: Number,
    min: [0, "Product price must be positive"],
    required: [true, "A product must have it's price"]
  },
  productStatus: {
    type: String,
    enum: ['available', 'unavailable']
  },
  productImage: {
    type: String
  }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

module.exports = Product;