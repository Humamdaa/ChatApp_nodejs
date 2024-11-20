const { User } = require("../../Models/UserModel");

const findUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return res.status(500).send("Error fetching user profile: " + err.message);
  }
};

module.exports = {
  findUser,
};

