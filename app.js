const express = require("express")
const app = express();
const { Server } = require('socket.io');
const { connectDatabase } = require('./database/database');
const authRoute = require('./routes/auth/authRoute')
const productRoute = require('./routes/admin/productRoute');
const adminUsersRoute = require('./routes/admin/adminUsersRoute')
const userReviewRoute = require('./routes/user/userReviewRoute')
const profileRoute = require('./routes/user/profileRoute');
const cartRoute = require('./routes/user/cartRoute')
const orderRoute = require("./routes/user/orderRoute");
const adminOrderRoute = require("./routes/admin/adminOrderRoute");
const paymentRoute = require("./routes/user/paymentRoute");

// tell node to use DOTENV
require('dotenv').config()

app.set('view engine', 'ejs');
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

app.get('/chat', (req, res) => {
  res.render('home.ejs');
})


// register user api

app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/admin", adminUsersRoute)
app.use("/api/admin", adminOrderRoute)
app.use("/api/reviews", userReviewRoute)
app.use("/api/profile", profileRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/payment", paymentRoute);

// app.post('/register', registerUser)

// // login user
// app.post('/login', loginUser)

// app.post('/forgotPassword', forgotPassword)



// listen server
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is up and running at port ` + PORT)
})

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('hello', (data) => {
    console.log('data');
  })
})