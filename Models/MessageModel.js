const mongoose = require("mongoose");

const MessageShema = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageShema);

module.exports = MessageModel;
