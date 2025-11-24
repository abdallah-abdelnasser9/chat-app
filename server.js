const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected");
  
  socket.on("setUsername", (username) => {
    socket.username = username;
    onlineUsers[socket.id] = username;

    io.emit("onlineUsers", Object.values(onlineUsers));
    socket.broadcast.emit("chatMessage", {
      user: "System",
      message: `${username} has joined the chat`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("sendMessage", (msg) => {
    const messageData = {
      user: socket.username,
      message: msg,
      time: new Date().toLocaleTimeString()
    };
    io.emit("chatMessage", messageData);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping", socket.username);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      delete onlineUsers[socket.id];
      io.emit("onlineUsers", Object.values(onlineUsers));
      io.emit("chatMessage", {
        user: "System",
        message: `${socket.username} has left the chat`,
        time: new Date().toLocaleTimeString()
      });
    }
    console.log("A user left");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
