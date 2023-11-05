const express = require("express")
const app = express();
const { connectDatabase } = require('./database/database');
const authRoute = require('./routes/authRoute')
const productRoute = require('./routes/productRoute');

// tell node to use DOTENV
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// telling node to give access to uploads folder
app.use(express.static('uploads'))

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

app.use("/api", authRoute)
app.use("/api", productRoute)

// app.post('/register', registerUser)

// // login user
// app.post('/login', loginUser)

// app.post('/forgotPassword', forgotPassword)



// listen server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and running at port ` + PORT)
})