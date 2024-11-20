const express = require("express");
const {
  getMessages,
  createMessage,
} = require("../Controllers/messages/messageController");

const router = express.Router();

router.post("/new/message", createMessage);
router.get("/msg/:chatId", getMessages);

module.exports = router;
