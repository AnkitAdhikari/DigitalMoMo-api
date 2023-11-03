const jwt = require('jsonwebtoken')
const { promisify } = require('util');
const User = require("../model/userModel")

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(400).json({
      status: "failed",
      message: "login required"
    })
  }

  // jwt.verify(token, process.env.SECRET_KEY, (err, success) => {
  //   if (err) {
  //     res.status(400).json({
  //       message: 'Invalid token'
  //     })
  //   } else {
  //     res.status(200).json({
  //       message: "Valid token"
  //     })
  //   }
  // });

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY)

    const userExist = await User.findOne({ _id: decoded.id })

    if (!userExist) {
      return res.status(400).json({
        status: "Failed",
        message: "User doesn't exists with that toekn/id"
      })
    }

    req.user = userExist;

    next();
  } catch (err) {
    res.status(403).json({
      status: "Failed",
      message: err.message
    })
  }
  // check if decode id exits in DB




  // next();
}

module.exports = isAuthenticated;