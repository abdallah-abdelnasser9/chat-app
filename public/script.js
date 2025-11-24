const socket = io();
let username = "";

const nameScreen = document.getElementById("nameScreen");
const chatScreen = document.getElementById("chatScreen");
const nameInput = document.getElementById("nameInput");
const chat = document.getElementById("chat");
const msgInput = document.getElementById("msgInput");
const typingDiv = document.createElement("div");

typingDiv.style.fontStyle = "italic";
typingDiv.style.color = "#ccc";
typingDiv.style.marginBottom = "10px";
chat.appendChild(typingDiv);

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
  if (text === "") return;

  socket.emit("sendMessage", text);
  msgInput.value = "";
  socket.emit("stopTyping");
}

// Enter key for both screens
nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") enterChat();
});

msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") send();
  else socket.emit("typing");
});

// Stop typing when input loses focus
msgInput.addEventListener("blur", () => {
  socket.emit("stopTyping");
});

// Receive chat messages
socket.on("chatMessage", (data) => {
  const div = document.createElement("div");
  div.classList.add("msg");

  // System message styling
  if (data.user === "System") {
    div.style.background = "rgba(255,255,255,0.2)";
    div.style.fontStyle = "italic";
    div.style.textAlign = "center";
  }
  else if (data.user === username) {
    div.classList.add("you");
  }

  div.innerHTML = `<span class="user">${data.user}</span>${data.message}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// Typing indicator
let typingUsers = new Set();

socket.on("typing", (user) => {
  typingUsers.add(user);
  updateTyping();
});

socket.on("stopTyping", (user) => {
  typingUsers.delete(user);
  updateTyping();
});

function updateTyping() {
  if (typingUsers.size === 0) {
    typingDiv.innerText = "";
  } else {
    typingDiv.innerText = `${[...typingUsers].join(", ")} typing...`;
  }
}
