const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  userEmail: {
    type: String,
    required: [true, "Email is required for a user"],
    unique: true,
    lowercase: true
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
    required: [true, "Password must be provided"],
    minLength: 8
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: "customer"
  },
  otp: {
    type: Number
  },
  cart: [{ type: Schema.Types.ObjectId, ref: "Product" }]
})

const User = mongoose.model('User', userSchema);

module.exports = User;