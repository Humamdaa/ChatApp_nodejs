const User = require("../../Models/UserModel");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } });
    if (!users) {
      return res.status(404).send("Users not found");
    }

    return res.status(200).json({
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error fetching user profile: " + err.message);
  }
};

module.exports = {
  getUsers,
};
