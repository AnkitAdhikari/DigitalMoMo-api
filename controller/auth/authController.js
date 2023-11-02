const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const User = require('./../../model/userModel');
const sendEmail = require('../../services/sendEmail');

exports.registerUser = async (req, res) => {

  const { email, password, phoneNumber, username } = req.body
  if (!email || !password || !phoneNumber || !username) {
    return res.status(400).json({
      message: "please provide email, password, phoneNUmber"
    })
  }

  // checking if user already exist
  const userFound = await User.find({ userName: username })
  if (userFound.length > 0) {
    return res.status(400).json({
      status: "failed",
      message: "User with that email already exists"
    })
  }

  await User.create({
    userName: username,
    userEmail: email,
    userPhoneNumber: phoneNumber,
    userPassword: bcrypt.hashSync(password, 10)
  })


  res.status(201).json({
    status: "success",
    message: "registration sucessful"
  })
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "please provide email or password",
    })
  }
  const userFound = await User.find({ userEmail: email })

  // check if the user with requested credentials exits
  if (userFound.length === 0) {
    // response for user credentials unmatched
    return res.status(404).json({
      message: "Invalid username or password",
      status: "failed"
    })
  }

  // response for user credentails matched
  const isPasswordMatched = bcrypt.compareSync(password, userFound[0].userPassword)

  if (isPasswordMatched) {
    // generate token
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: '30d'
    })

    return res.status(200).json({
      status: "success",
      message: "Logged In sucessfully",
      token
    })
  }

  res.status(404).json({
    message: "Invalid username or password",
    status: "failed"
  })

}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const userExists = await User.find({ userEmail: email })
  if (userExists.length === 0) {
    // user not found
    return res.status(400).json({
      status: "Failed",
      message: "User not found"
    })
  }
  // code for user found
  const otp = Math.floor(1000 + Math.random() * 9000)
  await sendEmail({
    email: email,
    subject: "Digital MoMo OTP",
    message: `OTP: ${otp}`
  })
  userExists[0].otp = otp;
  await userExists[0].save()

  res.status(200).json({
    status: "success",
    message: 'Email sent sucessfully'
  })

}