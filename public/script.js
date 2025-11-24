const socket = io();
let username = "";

const nameScreen = document.getElementById("nameScreen");
const chatScreen = document.getElementById("chatScreen");
const nameInput = document.getElementById("nameInput");
const chat = document.getElementById("chat");
const msgInput = document.getElementById("msgInput");
const typingDiv = document.getElementById("typing");

let typingTimeout;

// ---------------- ENTER CHAT ----------------
function enterChat() {
  const name = nameInput.value.trim();
  if (!name) return;

  username = name;

  socket.emit("setUsername", username);

  nameScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  msgInput.focus();
}

nameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    enterChat();
  }
});

// ---------------- SEND MESSAGE ----------------
function send() {
  const text = msgInput.value.trim();
  if (text === "") return;

  socket.emit("sendMessage", text);
  socket.emit("stopTyping");
  msgInput.value = "";
}

msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    send();
  } else {
    socket.emit("typing");
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping");
    }, 800);
  }
});

// ---------------- RECEIVE MESSAGE ----------------
socket.on("chatMessage", (data) => {
  const div = document.createElement("div");
  div.classList.add("msg");

  if (data.user === username) {
    div.classList.add("you");
  }

  div.innerHTML = `<span class="user">${data.user}</span>${data.message}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// ---------------- TYPING INDICATOR ----------------
socket.on("typing", (name) => {
  typingDiv.textContent = `${name} is typing...`;
});

socket.on("stopTyping", () => {
  typingDiv.textContent = "";
});
