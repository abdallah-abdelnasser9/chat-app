const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  // Set username
  socket.on("setUsername", (username) => {
    socket.username = username;

    // Notify other users
    socket.broadcast.emit("chatMessage", {
      user: "System",
      message: `${username} has joined the chat`
    });
  });

  // Chat messages
  socket.on("sendMessage", (msg) => {
    io.emit("chatMessage", {
      user: socket.username,
      message: msg
    });
  });

  // Typing indicator
  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping", socket.username);
  });

  // Disconnect
  socket.on("disconnect", () => {
    if(socket.username){
      io.emit("chatMessage", {
        user: "System",
        message: `${socket.username} has left the chat`
      });
    }
    console.log("A user left");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
