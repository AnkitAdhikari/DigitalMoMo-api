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

exports.updateMyOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { shippingAddress, items } = req.body;

  if (!shippingAddress || items.length == 0) {
    return res.status(400).json({
      message: "Please provide shippingAddress,items"
    })
  }

  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    return res.status(404).json({
      message: "No order with that id"
    })
  }

  // checking whether the user to update the order is associated with the product or not

  if (existingOrder.user !== userId) {
    return res.status(403).json({
      message: "You don't have permission to update this order"
    })
  }

  if (existingOrder.orderStatus == "ontheway") {
    return res.status(400).json({
      message: "you cannot update order when it is on the way"
    })
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, { shippingAddress, items }, { new: true })
  res.status(200).json({
    message: "Order updated sucessfully",
    data: updatedOrder,
  })
}

exports.deleteMyOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      message: "No order with that id"
    })
  }
  if (order.user !== userId) {
    return res.status(402).json({
      message: "You don't have permission to delete this order",
    })
  }
  await Order.findByIdAndDelete(id);
  res.json({
    message: "Order deleted successfully",
    data: null
  })
}

exports.cancelOrder = async (req, res) => {
  const userId = req.user;
  const { id } = req.params;

  // find if there is order associated with the requested id or not

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      message: "No order with that id"
    })
  }
  if (order.user !== userId) {
    return res.status(404).json({
      message: "You don't have permission to delete this order"
    })
  }

  if (order.orderStatus !== "pending") {
    return res.status(400).json({
      message: "You can't cancel this order as it is not on pending state"
    })
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, {
    order: "cancelled"
  }, { new: true })

  res.status(200).json({
    message: "Order cancelled successfully",
    data: updatedOrder
  })

}