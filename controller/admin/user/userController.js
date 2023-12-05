const User = require("../../../model/userModel");

exports.getUsers = async (req, res) => {
  const { id } = req.user;
  // console.log(req.user)

  // only fetching the essential data for admin
  const allUser = await User.find({ _id: { $ne: id } }).select("userEmail userName userPhoneNumber role")
  // console.log(allUser)
  if (allUser.length == 0) {
    return res.status(400).json({
      status: 'Failed',
      message: "No users found"
    })
  }
  res.status(200).json({
    status: "success",
    data: allUser
  })
}

// delete User API

exports.deleteUser = async (req, res) => {
  const userId = req.params.id
  if (!userId) {
    return res.status(400).json({
      message: "Please provide userId"
    })
  }
  const user = await User.findById(userId)
  if (!user) {
    res.status(400).json({
      message: "user not found with that userid"
    })
  } else {
    await User.findByIdAndDelete(userId)
    res.status(200).json({
      message: "user deleted sucessfully"
    })
  }
}