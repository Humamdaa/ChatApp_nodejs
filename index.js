const express = require("express");
const cors = require("cors");
const connectToDB = require("./db");
require("dotenv").config();
const app = express();

connectToDB();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));


const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

app.use("/", userRoute);
app.use("/", chatRoute);
app.use("/", messageRoute);


const Port = process.env.PORT || 5001;

app.listen(Port, (req) => {
  console.log(`server running on port ${Port}`);
});
