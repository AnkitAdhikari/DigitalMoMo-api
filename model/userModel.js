const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  userEmail: {
    type: String,
    required: [true, "Email is required for a user"],

  },
  userName: {
    type: String,
    required: [true, "username is required"]
  },
  userPhoneNumber: {
    type: Number,
    required: [true, "PhoneNumber is required"]
  },
  userPassword: {
    type: String,
    required: [true, "Password must be provided"]
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: "customer"
  }
})

const User = mongoose.model('User', userSchema);

module.exports = User;