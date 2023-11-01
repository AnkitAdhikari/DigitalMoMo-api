const express = require("express")
const app = express();
const { connectDatabase } = require('./database/database');
const User = require("./model/userModel");
const jwt = require('jsonwebtoken')


const bcrypt = require("bcrypt");

// tell node to use DOTENV
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database connectin
connectDatabase();

// test api to check if server is live or not
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Server is live"
  })
})


// register user api
app.post('/register', async (req, res) => {

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
      status: "success",
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
})

app.post('/login', async (req, res) => {
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

})



// listen server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and running at port ` + PORT)
})