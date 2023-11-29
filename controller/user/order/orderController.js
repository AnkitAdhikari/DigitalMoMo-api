const Order = require("../../../model/orderSchema");

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, items, totalAmount, paymentDetails } = req.body;
  if (!shippingAddress || !items.length > 0 || !totalAmount || !paymentDetails) {
    return res.status(400).json({
      message: "Please provide shippingAddress, items,totalAmount and paymentDetails"
    })
  }

  await Order.create({
    user: userId,
    shippingAddress,
    totalAmount,
    items,
    paymentDetails
  })
  res.status(200).json({
    message: "Order created sucessfully"
  })
}


exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).populate({
    path: "items.product",
    model: "Product",
    select: "-productStockQty -createdAt -updatedAt -reviews -__v"
  })
  if (orders.length == 0) {
    return res.status(400).json({
      message: "Orders not found",
      data: []
    })
  }
  res.status(200).json({
    message: "Orders Fetched sucessfully",
    data: orders
  })
}
