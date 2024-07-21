const commands = [
  // -- Effects
  "!say",
  // --- Emoji (index >= 1)
  "!happy",
  "!sad",
  "!laugh",
  "!clap",
  "!heart",
  "!wow",
  "!party",
];

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
  const emojiDiv = document.createElement("div");
  emojiDiv.textContent = emoji;
  emojiDiv.classList.add("emoji");
  emojiDiv.style.left = `${Math.random() * 80 + 10}%`;
  emojiDiv.style.bottom = "20%";
  document.body.appendChild(emojiDiv);

  setTimeout(() => {
    const randomAnimation =
      animationStyles[Math.floor(Math.random() * animationStyles.length)];
    emojiDiv.classList.add("effect", randomAnimation);
    setTimeout(() => emojiDiv.remove(), 2000);
  }, 100);
}

function createWaveTextElement(text) {
  const waveText = document.createElement("p");
  waveText.classList.add("wave-text");

  text.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${index * 0.1}s`;
    waveText.appendChild(span);
  });
  document.body.appendChild(waveText);

  setTimeout(() => waveText.remove(), 2000);
}

function handleNewMessage(node) {
  const messageText = node.textContent.trim().toLowerCase();
  const commandIdx = commands.findIndex((command) =>
    messageText.startsWith(command)
  );

  if (commandIdx === 0) {
    const text = node.textContent.trim().substring(5);
    createWaveTextElement(text);
  } else if (commandIdx >= 1) {
    Object.entries(emojiMap).forEach(([command, emoji]) => {
      if (messageText.includes(command)) {
        createEmojiElement(emoji);
      }
    });
  }
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
      observer.observe(chatContainer, { childList: true, subtree: true });
    } else {
      setTimeout(startObserver, 1000);
    }
  }

  startObserver();
}

// Initial setup
function init() {
  observeChatMessages();
}

// Start the extension
init();
