// createChat
// getUserChat
// findChat

const ChatModel = require("../../Models/ChatModel");
const User = require("../../Models/UserModel");

const createChat = async (req, res) => {
  let { firstId, secondId } = req.body;
  try {
    if (secondId === "null") {
      secondId = req.user.userId;
    }

    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });


    if (chat) {
      return res.status(200).send({ message: flase });
    } else {
      const newChat = new ChatModel({
        members: [firstId, secondId],
      });
      const response = await newChat.save();
      return res.status(200).send({ message: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const findUserChat = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the chats where the user is a member
    const chats = await ChatModel.find({
      members: { $in: [userId] }, // Find chats where userId is in the members array
    });

    // If no chats found, send an empty response
    if (chats.length === 0) {
      return res.status(200).send({ message: "No chats found for this user." });
    }

    // For each chat, manually populate the members with their names
    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        // Initialize an array to hold the combined userIds and members with their names
        const populatedMembers = await Promise.all(
          chat.members.map(async (memberId) => {
            // Skip the current user
            if (userId === memberId) {
              return null; // Skip the current user, don't include them in the members list
            }
            const user = await User.findById(memberId).select("name");
            // Return an object with both 'name' and 'id' if the user is found
            return user ? { name: user.name, id: user._id } : null;
          })
        );

        // Filter out null values (the current user) from the array of members
        const filteredMembers = populatedMembers.filter(
          (member) => member !== null
        );

        return {
          _id: chat._id,
          members: filteredMembers, // Members now contain both name and id
        };
      })
    );
    // console.log("pop:", populatedChats);
    // Send the populated chats with member names and userIds
    res.status(200).send({ chats: populatedChats });
  } catch (error) {
    console.log(error);
    res.status(500).send(error); // Send error response in case of any issues
  }
};

const findChat = async (req, res) => {
  let { firstId, secondId } = req.params;
  if (secondId === "null") {
    secondId = req.user.userId;
    // console.log(secondId);
  }

  try {
    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      res.status(200).send(chat);
    } else res.status(404).send(" chat is not found");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  findChat,
  findUserChat,
  createChat,
};
