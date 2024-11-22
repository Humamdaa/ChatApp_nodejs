const express = require("express");
const {
  createChat,
  findUserChat,
  findChat,
} = require("../Controllers/chat/chatController");

const { verifyToken } = require("../Middleware/verify_token");

const router = express.Router();

router.post("/chat", createChat);
router.get("/:userId", findUserChat);
router.post("/find/:firstId/:secondId",verifyToken, findChat);

module.exports = router;