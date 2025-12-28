document.addEventListener("DOMContentLoaded", () => {

  /* ========== Inject chatbot UI ========== */
  const chatbotHTML = `
    <div id="chatButton">💬</div>

    <div id="chatbot">
      <div id="chatHeader">Ask Silkim</div>
      <div id="chatMessages">
        <p><strong>Silkim:</strong> Ask about Bhutan, Ladakh, Sikkim, seasons, or journeys.</p>
      </div>
      <input id="chatInput" placeholder="Type your question and press Enter…" />
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  const chatButton = document.getElementById("chatButton");
  const chatbot = document.getElementById("chatbot");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");

  chatButton.onclick = () => {
    chatbot.style.display =
      chatbot.style.display === "flex" ? "none" : "flex";
  };

  /* ========== KNOWLEDGE BASE ========== */

  const knowledge = [
    {
      intent: "bhutan",
      keywords: ["bhutan"],
      reply:
        "Bhutan journeys are shaped by altitude, monsoon timing, and cultural calendars. Routes emphasize slow movement and seasonal clarity."
    },
    {
      intent: "ladakh",
      keywords: ["ladakh"],
      reply:
        "Ladakh demands respect for altitude and season. Journeys are designed around acclimatization, high passes, and short climatic windows."
    },
    {
      intent: "sikkim",
      keywords: ["sikkim"],
      reply:
        "Sikkim routes respond to forest belts, rainfall patterns, and Himalayan geography. Timing matters more than distance."
    },
    {
      intent: "season",
      keywords: ["season", "best time", "when"],
      reply:
        "Season is the primary design constraint. Each journey runs only when terrain, weather, and access align naturally."
    },
    {
      intent: "journey",
      keywords: ["journey", "trip", "expedition", "route"],
      reply:
        "Silkim journeys are terrain-led, not checklist-driven. Fewer places, longer stays, and routes shaped by geography."
    },
    {
      intent: "difficulty",
      keywords: ["difficulty", "fitness", "hard", "easy"],
      reply:
        "Difficulty varies by altitude and terrain. Journeys prioritize gradual pacing and acclimatization rather than endurance."
    },
    {
      intent: "price",
      keywords: ["price", "cost", "pricing", "budget"],
      reply:
        "Pricing depends on region, duration, season, and logistics. Every journey is custom-built rather than packaged."
    }
  ];

  /* ========== INTENT MATCHER ========== */

  function findIntent(text) {
    const lower = text.toLowerCase();

    return knowledge.find(entry =>
      entry.keywords.some(keyword => lower.includes(keyword))
    );
  }

  /* ========== ESCALATION HEURISTICS ========== */

  function needsHuman(text) {
    const triggers = [
      "custom",
      "private",
      "design",
      "plan",
      "combine",
      "itinerary",
      "family",
      "medical",
      "dates",
      "permit",
      "price for",
      "quotation"
    ];

    return triggers.some(t => text.toLowerCase().includes(t));
  }

  /* ========== INPUT HANDLER ========== */

  input.addEventListener("keydown", e => {
    if (e.key !== "Enter" || input.value.trim() === "") return;

    const userText = input.value.trim();
    input.value = "";

    messages.innerHTML +=
      `<p><strong>You:</strong> ${userText}</p>`;

    const intent = findIntent(userText);

    if (intent && !needsHuman(userText)) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${intent.reply}</p>`;
    } else {
      const phone = "917029066906"; // ← your WhatsApp number
      const url =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent("Website inquiry: " + userText);

      messages.innerHTML +=
        `<p><strong>Silkim:</strong> This needs a deeper conversation. I’ll connect you directly.</p>`;

      window.open(url, "_blank");
    }

    messages.scrollTop = messages.scrollHeight;
  });

});
