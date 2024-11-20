const MessageModel = require("../../Models/MessageModel");

// createMessage
const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const savedMessage = await message.save();
    res.status(200).send(savedMessage);
  } catch (error) {
    res.status(500).send({ message: "Failed to create message" });
  }
};

// getMessages

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await MessageModel.find({ chatId }).sort({
      createdAt: -1,
    });
    if (messages) {
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
