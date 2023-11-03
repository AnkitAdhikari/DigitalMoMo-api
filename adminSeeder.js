const User = require('./model/userModel')
const bcrypt = require("bcrypt")

// admin seeding
const adminSeeder = async () => {

  // checking if admin already exists
  const isAdminExists = await User.findOne({ userEmail: "admin@gmail.com" })

  if (!isAdminExists) {
    await User.create({
      userEmail: "admin@gmail.com",
      userPassword: bcrypt.hashSync('admin', 10),
      userPhoneNumber: 9248324238,
      userName: "admin",
      role: 'admin'
    })

    console.log("Admin seeded sucessfully")
  } else {
    console.log("Admin already seeded");
  }

}
module.exports = adminSeeder;