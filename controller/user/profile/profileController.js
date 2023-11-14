const User = require("../../../model/userModel")
const bcrypt = require("bcrypt")


// get my profile contorller
exports.getMyProfile = async (req, res) => {
  const userId = req.user.id
  const myProfile = await User.findById(userId)
  // send response
  res.status(200).json({
    data: myProfile,
    message: "Profile fetched sucessfully"
  })
}



// update my profile controller
exports.updateMyProfile = async (req, res) => {
  const { userEmail, userPhoneNumber, userName } = req.boy
  const userId = req.user.id
  // update profile

  const updatedData = await User.findByIdAndUpdate(userId, {
    userEmail,
    userPhoneNumber,
    userName
  }, { runValidators: true })
  res.status(200).json({
    message: "Profile updated sucessfully",
    data: updatedData
  })
}



// delete my profile
exports.deleteMyProfile = async (req, res) => {
  const userId = req.user.id;
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "Profile delete sucessfully",
    data: null
  })
}

// update my password
exports.updateMyPassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Please provide oldpassword,newpassword,confirmPassword"
    })
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "newPassword and oldPassword didn't matched",
    })
  }

  // getting old has password
  const userData = await User.findById(userId);
  const hashedOldPassword = userData.userPassword;

  // check if oldpassword is correct or not
  const isOldPasswordCorrect = bcrypt.compareSync(oldPassword, hashedOldPassword);
  if (!isOldPasswordCorrect) {
    return res.status(400).json({
      message: "incorrect old password"
    })
  }
  // update matched
  userData.userPassword = bcrypt.hashSync(newPassword, 12)
  await userData.save()
  res.status(200).json({
    message: "Password changed successfully"
  })
}