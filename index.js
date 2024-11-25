const express = require("express");
const cors = require("cors");
const connectToDB = require("./db");
require("dotenv").config();
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from the frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  },
});

connectToDB();
app.use(express.json());

// CORS configuration for API routes
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from the frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use((req, res, next) => {
  req.io = io; // Attach socket.io instance to the request object
  next(); // Continue to the next middleware or route
});

// Apply CORS to all routes
app.use(cors(corsOptions));

// Your routes
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

app.use("/", userRoute);
app.use("/", chatRoute);
app.use("/", messageRoute);

// Define the socket event listeners
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join a chat room when a user connects
  socket.on("joinChat", (chatId) => {
    console.log(`User joined chat room: ${chatId}`);
    socket.join(chatId);
  });

  socket.on("online", (token) => {
    // console.log(`online: ${token}`);
  });

  socket.on("leaveApp", (token) => {
    console.log(`leave: ${token}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const Port = process.env.PORT || 5001;
server.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
