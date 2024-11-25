const MessageModel = require("../../Models/MessageModel");

// createMessage
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const newMessage = new MessageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const savedMessage = await newMessage.save();
    // console.log(senderId);
    // socket.io

    req.io.to(chatId).emit("newMessage", savedMessage);

    res.status(200).send(savedMessage);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Failed to create message" });
  }
};

// getMessages
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await MessageModel.find({ chatId }).sort({
      createdAt: 1,
    });
    // console.log("msgs:", messages);
    if (messages && messages.length > 0) {
      console.log(messages);
      res.status(200).send(messages);
    } else {
      res.status(404).send({ message: "No messages found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to get messages" });
  }
};

module.exports = {
  createMessage,
  getMessages,
};
