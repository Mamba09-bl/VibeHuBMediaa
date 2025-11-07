const express = require("express")
const app = express()
const index = require("./routers/index")
const userRouter = require("./routers/user-Router")
const cookieParser = require("cookie-parser");
const message = require('./models/chat-module')






const path = require("path")
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// require("dotenv").config();
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser());

app.use('/',index)
app.use('/users',userRouter)

const socket = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socket(server);


io.on("connection", (socket) => {
  console.log("User connected");

  // join a room when chat opens
  socket.on("join room", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  // send message
  socket.on("chat message", async (data) => {
    const newMsg = await message.create({
      text: data.text,
      sender: data.sender,
      receiver: data.receiver
    });

    const roomId = [data.sender, data.receiver].sort().join("_");
    io.to(roomId).emit("chat show", newMsg);  // send only to this room
  });
});


server.listen(4000)