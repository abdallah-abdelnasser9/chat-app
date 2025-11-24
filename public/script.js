const socket = io();
let username = "";

const nameScreen = document.getElementById("nameScreen");
const chatScreen = document.getElementById("chatScreen");
const nameInput = document.getElementById("nameInput");
const chat = document.getElementById("chat");
const onlineUsersEl = document.getElementById("onlineUsers");
const msgInput = document.getElementById("msgInput");
const typingEl = document.getElementById("typing");

// Enter chat
function enterChat() {
  const name = nameInput.value.trim();
  if (!name) return;

  username = name;
  socket.emit("setUsername", username);

  nameScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  msgInput.focus();
}

// Send message
function send() {
  const text = msgInput.value.trim();
  if (!text) return;

  socket.emit("sendMessage", text);
  msgInput.value = "";
  socket.emit("stopTyping");
}

// Typing events
msgInput.addEventListener("input", () => {
  if (msgInput.value.trim() !== "") {
    socket.emit("typing");
  } else {
    socket.emit("stopTyping");
  }
});

msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") send();
});

nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enterChat();
});

// Receive messages
socket.on("chatMessage", (data) => {
  const div = document.createElement("div");
  div.classList.add("msg");
  if (data.user === username) div.classList.add("you");

  div.innerHTML = `<span class="user">${data.user}</span> <span class="time">[${data.time}]</span><br>${data.message}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// Receive online users
socket.on("onlineUsers", (users) => {
  onlineUsersEl.innerHTML = "";
  users.forEach((u) => {
    const li = document.createElement("li");
    li.textContent = u;
    onlineUsersEl.appendChild(li);
  });
});

// Typing indicator
socket.on("typing", (user) => {
  typingEl.textContent = `${user} is typing...`;
});

socket.on("stopTyping", (user) => {
  typingEl.textContent = "";
});
