const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const connectToDB = require("./db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  },
});

connectToDB();
app.use(express.json());

// Apply CORS to all routes
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from the frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  req.io = io; // Attach socket.io instance to the request object
  next(); // Continue to the next middleware or route
});

// Your route imports
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

app.use("/", userRoute);
app.use("/", chatRoute);
app.use("/", messageRoute);

// Socket.io connection handling
require("./SocketHandler")(io); // Import socket handlers

const Port = process.env.PORT || 5001;
server.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
