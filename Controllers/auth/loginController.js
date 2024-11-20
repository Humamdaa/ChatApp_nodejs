const User = require("../../Models/UserModel");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  // Validation: Ensure email and password are provided
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "User not found, please register", status: 400 });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid password", status: 400 });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
      status: 200,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Login error: " + err.message);
  }
};

module.exports = {
  login,
};
