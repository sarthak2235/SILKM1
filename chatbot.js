// ================= CHATBOT =================

document.addEventListener("DOMContentLoaded", () => {

  // Inject chatbot HTML automatically
  const chatbotHTML = `
    <div id="chatButton">💬</div>

    <div id="chatbot">
      <div id="chatHeader">Ask Silkim</div>
      <div id="chatMessages">
        <p><strong>Silkim:</strong> Ask about journeys, seasons, or routes.</p>
      </div>
      <input id="chatInput" placeholder="Type your question and press Enter…" />
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  const chatButton = document.getElementById("chatButton");
  const chatbot = document.getElementById("chatbot");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");

  chatButton.addEventListener("click", () => {
    chatbot.style.display =
      chatbot.style.display === "flex" ? "none" : "flex";
  });

  const basicAnswers = [
    {
      keywords: ["price", "cost", "pricing"],
      reply:
        "Pricing depends on terrain, season, and duration. Every journey is custom-designed."
    },
    {
      keywords: ["best time", "season", "when"],
      reply:
        "Each journey is seasonal. We travel when landscapes truly open."
    },
    {
      keywords: ["where", "location", "region"],
      reply:
        "Our routes are shaped by altitude, rivers, and climate systems."
    },
    {
      keywords: ["difficulty", "fitness"],
      reply:
        "Difficulty varies by terrain and altitude, with slow acclimatization built in."
    }
  ];

  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const userText = chatInput.value;
      chatInput.value = "";

      chatMessages.innerHTML +=
        `<p><strong>You:</strong> ${userText}</p>`;

      const match = basicAnswers.find(a =>
        a.keywords.some(k => userText.toLowerCase().includes(k))
      );

      if (match) {
        chatMessages.innerHTML +=
          `<p><strong>Silkim:</strong> ${match.reply}</p>`;
      } else {
        const phone = "917029066906"; // your WhatsApp number
        const url =
          "https://wa.me/" +
          phone +
          "?text=" +
          encodeURIComponent("Website question: " + userText);

        chatMessages.innerHTML +=
          `<p><strong>Silkim:</strong> This needs a deeper conversation. Connecting you directly.</p>`;

        window.open(url, "_blank");
      }

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });

});

