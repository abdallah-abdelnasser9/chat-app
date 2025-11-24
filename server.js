const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("setUsername", (username) => {
    socket.username = username;
  });

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
    socket.broadcast.emit("stopTyping");
  });

  socket.on("disconnect", () => {
    console.log("A user left");
  });
});

http.listen(3000, () => console.log("Server running on http://localhost:3000"));
