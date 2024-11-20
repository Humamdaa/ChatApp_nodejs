const express = require("express");
const { register } = require("../Controllers/auth/registerController");

const { login } = require("../Controllers/auth/loginController");
const { verifyToken } = require("../Middleware/verify_token");
const { profile } = require("../Controllers/user/profileController");
const { findUser } = require("../Controllers/user/findUser");
const { getUsers } = require("../Controllers/user/allUsers");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, profile);
router.get("/user/:UserId", verifyToken, findUser);
router.get("/all/users", verifyToken, getUsers);


module.exports = router;
