// createChat
// getUserChat
// findChat

const ChatModel = require("../../Models/ChatModel");
const User = require("../../Models/UserModel");
const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await ChatModel.findOne({
      members: { $all: { firstId, secondId } },
    });

    if (chat) {
      res.status(200).send(chat);
    } else {
      const newChat = new ChatModel({
        members: [firstId, secondId],
      });
      const response = await newChat.save();
      res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const findUserChat = async (req, res) => {
  const userId = req.params.userId;
  console.log("id: ", userId);

  try {
    // Find the chats where the user is a member
    const chats = await ChatModel.find({
      members: { $in: [userId] }, // Find chats where userId is in the members array
    });

    // If no chats found, send an empty response
    if (chats.length === 0) {
      return res.status(200).send("No chats found for this user.");
    }

    // For each chat, manually populate the members with their names
    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        // Fetch the user details for each member in the chat, except the current user
        const populatedMembers = await Promise.all(
          chat.members.map(async (memberId) => {
            // Skip current user
            if (userId === memberId) {
              return null; // Or you can return `"You"` to indicate the current user
            }

            const user = await User.findById(memberId).select("name");
            return user ? user.name : "Unknown User"; // Return name or fallback to "Unknown User"
          })
        );

        // Remove null values (i.e., the current user) from the array of members
        const filteredMembers = populatedMembers.filter(
          (member) => member !== null
        );

        // Return the chat data with populated member names (filtered to exclude the current user)
        return { ...chat.toObject(), members: filteredMembers };
      })
    );

    // Log the populated chats to verify the results
    console.log("populated chats:", populatedChats);

    // Send the populated chats with member names
    res.status(200).send(populatedChats);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) res.status(200).send(chat);
    else res.status(404).send(" chat is not found");
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
