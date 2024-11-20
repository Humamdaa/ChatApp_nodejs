const express = require("express");
const {
  createChat,
  findUserChat,
  findChat,
} = require("../Controllers/chat/chatController");

const router = express.Router();

router.post("/chat", createChat);
router.get("/:userId", findUserChat);
router.post("/find/:firstId/:secondId", findChat);

module.exports = router;