const mongoose = require('mongoose')
const User = require('../model/userModel')
const adminSeeder = require('../adminSeeder')

exports.connectDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("Database sucessfully connected")
  adminSeeder();
}