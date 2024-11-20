const jwt = require("jsonwebtoken");
const User = require("../../Models/UserModel");

// You can store your JWT secret in an environment variable for security.
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const SALT = 10; // Assuming SALT is used for hashing passwords, not for JWT generation

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation: Ensure all fields are provided
  if (!name || !email || !password) {
    return res.status(400).send("Name, email, and password are required");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "Email is already in use", status: 400 });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password, 
    });

    await newUser.save();
    console.log("User created successfully");

    // Generate a JWT token after successful registration
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" } 
    );

    return res.status(201).send({
      message: "User created successfully",
      status: 201,
      token: token, 
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ message: "Error creating user: " + err.message });
  }
};

module.exports = {
  register,
};
