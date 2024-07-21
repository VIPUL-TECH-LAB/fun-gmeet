const emojiMap = {
  "!happy": "😊",
  "!sad": "😢",
  "!laugh": "😂",
  "!clap": "👏",
  "!heart": "❤️",
  "!wow": "😮",
  "!party": "🎉",
};

const animationStyles = [
  "float-up",
  "bounce",
  "spin",
  "zigzag",
  "pulse",
  "shake",
];

function createEmojiElement(emoji) {
  console.log("Creating emoji element:", emoji);
  const emojiDiv = document.createElement("div");
  emojiDiv.textContent = emoji;
  emojiDiv.classList.add("meet-emoji");
  emojiDiv.style.left = `${Math.random() * 80 + 10}%`;
  emojiDiv.style.bottom = "20%";
  document.body.appendChild(emojiDiv);

  setTimeout(() => {
    const randomAnimation =
      animationStyles[Math.floor(Math.random() * animationStyles.length)];
    emojiDiv.classList.add("emoji-animate", randomAnimation);
    setTimeout(() => emojiDiv.remove(), 2000);
  }, 100);
}

function handleNewMessage(node) {
  console.log("Handling new message:", node);
  const messageText = node.textContent.trim().toLowerCase();
  Object.entries(emojiMap).forEach(([command, emoji]) => {
    if (messageText.includes(command)) {
      createEmojiElement(emoji);
    }
  });
}

function findChatContainer() {
  const xpath = "//div[text()='In-call messages']";
  const matchingElement = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  return matchingElement?.parentNode.nextElementSibling.firstChild.firstChild
    .childNodes[2];
}

function observeChatMessages() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const messageNode = node.querySelector("[data-is-tv]");
          if (messageNode && !messageNode.dataset.messageParsed) {
            handleNewMessage(messageNode);
            messageNode.dataset.messageParsed = "true";
          }
        }
      });
    });
  });

  function startObserver() {
    const chatContainer = findChatContainer();
    if (chatContainer) {
      console.log("Chat container found, starting observer");
      observer.observe(chatContainer, { childList: true, subtree: true });
    } else {
      console.log("Chat container not found, retrying in 1 second");
      setTimeout(startObserver, 1000);
    }
  }

  startObserver();
}

// Initial setup
function init() {
  console.log("Initializing Google Meet Emoji Reactions extension");
  observeChatMessages();
}

// Start the extension
init();
