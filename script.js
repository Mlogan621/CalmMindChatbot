const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const puter = window.puter;
let chatHistory = [];

async function loadChatHistory() {
  try {
    const data = await puter.fs.readFile('/chat-history.json');
    chatHistory = JSON.parse(data);
    chatHistory.forEach(msg => renderMessage(msg.text, msg.sender));
  } catch (err) {
    chatHistory = [];
  }
}

async function saveChatHistory() {
  await puter.fs.writeFile('/chat-history.json', JSON.stringify(chatHistory));
}

function renderMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse() {
  return calmResponses[Math.floor(Math.random() * calmResponses.length)];
}

chatForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  renderMessage(text, "user");
  chatHistory.push({ text, sender: "user" });

  const botText = getBotResponse();
  setTimeout(() => {
    renderMessage(botText, "bot");
    chatHistory.push({ text: botText, sender: "bot" });
    saveChatHistory();
  }, 600);

  userInput.value = "";
  saveChatHistory();
});

window.addEventListener("DOMContentLoaded", loadChatHistory);