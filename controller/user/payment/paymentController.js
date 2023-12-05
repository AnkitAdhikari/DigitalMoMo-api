const { default: axios } = require("axios")
const Order = require("../../../model/orderSchema")


exports.initiateKhaltiPayment = async (req, res) => {
  // getting orderId and amount form body
  const { orderId, amount } = req.body
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Please provide orderId,amount"
    })
  }


  // preparing data object for the hitting khalti payment endpoint
  const data = {
    return_url: "http://localhost:8000/api/payment/success",
    purchase_order_id: orderId,
    amount: amount,
    website_url: "http://localhost:8000/",
    purchase_order_name: "orderName_" + orderId
  }

  // khalti endpoint 
  const response = await axios.post("https://a.khalti.com/api/v2/epayment/initiate/", data, {
    headers: {
      'Authorization': 'key 160e051c06c946659c4651bc3dc25a8c'
    }
  })
  let order = await Order.findById(orderId)
  order.paymentDetails.pidx = response.data.pidx;
  await order.save();
  // redirect to sucess page specified in data object previously
  res.redirect(response.data.payment_url);
}

exports.verifyPidx = async (req, res) => {
  const pidx = req.query.pidx;

  const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/", { pidx }, {
    headers: {
      'Authorization': 'key 160e051c06c946659c4651bc3dc25a8c'
    }
  })

  if (response.data.status == 'Completed') {
    let order = await Order.find({ 'paymentDetails.pidx': pidx })
    order[0].paymentDetails.method = "Khalti";
    order[0].paymentDetails.status = "paid";
    await order[0].save();
    res.redirect("http://localhost:3000");
  } else {
    res.redirect("http://localhost:3000/errorPage")
  }
}