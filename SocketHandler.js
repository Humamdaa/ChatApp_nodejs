module.exports = (io) => {
  const onlineUsers = new Set(); // To track connected users
  let userId;
  io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);
    // Handle when a user goes online
    socket.on("online", (id) => {
      userId = id;
      console.log(`User with is online ${id}`);
      // Store the socket id with the user's token (you can store this in a database or memory)
      onlineUsers.add(id);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    // Handle when a user leaves the app
    socket.on("leaveApp", (token) => {
      console.log(`User with left the app`);
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });

    // Join a chat room when a user connects
    // to check if user existes in the same chat
    socket.on("joinChat", (chatId) => {
      console.log(`User  ${userId}  joined chat room: ${chatId}`);
      socket.join(chatId);
      socket.emit("chatStatus", { chatId, userId, status: "joined" });
    });
    socket.on("checkChatStatus", (chatId) => {
      const isInRoom = socket.rooms.has(chatId); // Check if the user is in the specified chat room
      socket.emit("chatStatus", {
        chatId,
        status: isInRoom ? "joined" : "not in",
      });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected: ", socket.id);
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });
  });

  // Optionally, you could expose the list of online users via a socket event
  io.on("getOnlineUsers", (callback) => {
    callback(Array.from(onlineUsers)); // Send back the list of connected user IDs
  });
};
