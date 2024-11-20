const User = require("../../Models/UserModel");

const profile = async (req, res) => {
  try {
    // console.log("uerid", req.user.userId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error fetching user profile: " + err.message);
  }
};

module.exports = {
  profile,
};
