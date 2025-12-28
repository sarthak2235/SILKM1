document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     UI INJECTION
     ===================================================== */

  const chatbotHTML = `
    <div id="chatButton">💬</div>

    <div id="chatbot">
      <div id="chatHeader">Ask Silkim</div>
      <div id="chatMessages">
        <p><strong>Silkim:</strong> Hello. How can I help you today?</p>
      </div>
      <div id="chatSuggestions"></div>
      <input id="chatInput" placeholder="Type your message and press Enter…" />
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  const chatButton = document.getElementById("chatButton");
  const chatbot = document.getElementById("chatbot");
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  const suggestionsBox = document.getElementById("chatSuggestions");

  chatButton.onclick = () => {
    chatbot.style.display =
      chatbot.style.display === "flex" ? "none" : "flex";
  };

  /* =====================================================
     SOCIAL LAYER
     ===================================================== */

  const greetings = ["hi", "hello", "hey", "good morning", "good evening"];

  const statusQuestions = [
    "how are you",
    "how are you doing",
    "how r u"
  ];

  const positiveStatusReplies = [
    "i am fine",
    "i am good",
    "i'm fine",
    "i'm good",
    "doing well",
    "all good",
    "fine",
    "good"
  ];

  /* =====================================================
     KNOWLEDGE BASE
     ===================================================== */

  const knowledge = {
    sikkim: {
      altitude:
        "Sikkim journeys range from about 1,200 m to 4,200 m, with gradual ascents through forested and alpine terrain.",
      season:
        "The best seasons for Sikkim are March–June and September–November.",
      difficulty:
        "Sikkim routes are generally moderate and well-suited for first-time Himalayan travelers.",
      duration:
        "Sikkim journeys typically last 8–12 days.",
      overview:
        "Sikkim journeys emphasize monasteries, forest belts, and alpine valleys.",
      convenience:
        "Sikkim is one of the most convenient Himalayan journeys."
    },

    ladakh: {
      altitude:
        "Ladakh journeys operate between 3,200 m and 5,200 m.",
      season:
        "Ladakh is accessible mainly from June to September.",
      difficulty:
        "Ladakh is the most demanding due to sustained high altitude.",
      duration:
        "Ladakh journeys usually span 10–14 days.",
      overview:
        "Ladakh routes follow historic trade corridors.",
      convenience:
        "Ladakh requires the most preparation."
    },

    bhutan: {
      altitude:
        "Bhutan journeys range from river valleys to passes around 4,500 m.",
      season:
        "The best seasons for Bhutan are March–May and September–November.",
      difficulty:
        "Bhutan routes are moderate and culturally focused.",
      duration:
        "Bhutan journeys typically last 10–14 days.",
      overview:
        "Bhutan journeys focus on interior valleys and monasteries.",
      convenience:
        "Bhutan is logistically smooth but regulated."
    }
  };

  /* =====================================================
     DETECTION HELPERS
     ===================================================== */

  const destinations = ["sikkim", "ladakh", "bhutan"];

  const topics = {
    altitude: ["altitude", "height", "elevation"],
    season: ["season", "best time", "when"],
    difficulty: ["difficulty", "hard", "easy"],
    duration: ["duration", "days", "how long"],
    convenience: ["convenient", "easy"],
    overview: ["journey", "route", "trip"]
  };

  function detectDestination(text) {
    return destinations.find(d => text.includes(d));
  }

  function detectTopic(text) {
    for (const topic in topics) {
      if (topics[topic].some(k => text.includes(k))) {
        return topic;
      }
    }
    return "overview";
  }

  /* =====================================================
     SUGGESTIONS
     ===================================================== */

  function renderSuggestions(list) {
    suggestionsBox.innerHTML = "";
    list.forEach(q => {
      const btn = document.createElement("button");
      btn.textContent = q;
      btn.onclick = () => {
        input.value = q;
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      };
      suggestionsBox.appendChild(btn);
    });
  }

  function clearSuggestions() {
    suggestionsBox.innerHTML = "";
  }

  /* =====================================================
     INPUT HANDLER
     ===================================================== */

  input.addEventListener("keydown", e => {
    if (e.key !== "Enter" || input.value.trim() === "") return;

    const rawText = input.value.trim();
    const text = rawText.toLowerCase();
    input.value = "";
    clearSuggestions();

    messages.innerHTML += `<p><strong>You:</strong> ${rawText}</p>`;

    /* ---- Greetings ---- */
    if (greetings.includes(text)) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> Hello. What would you like to know?</p>`;
      return;
    }

    /* ---- Status question ---- */
    if (statusQuestions.some(q => text.includes(q))) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> I’m doing well, thank you. How about you?</p>`;
      return;
    }

    /* ---- Status reply (THIS IS THE FIX) ---- */
    if (positiveStatusReplies.some(r => text.includes(r))) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> Glad to hear that. What would you like to know about our journeys?</p>`;

      renderSuggestions([
        "Best season for Ladakh?",
        "Is Sikkim suitable for first-time travelers?",
        "Which journey is more difficult?",
        "What should I bring for the journey?"
      ]);
      return;
    }

    /* ---- Destination logic ---- */
    const destination = detectDestination(text);
    const topic = detectTopic(text);

    if (destination) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${knowledge[destination][topic]}</p>`;

      renderSuggestions([
        `Best season for ${destination}?`,
        `Difficulty of ${destination} journey?`,
        `How many days are ideal for ${destination}?`
      ]);
      return;
    }

    /* ---- Fallback: WhatsApp ---- */
    const phone = "917029066906"; // replace with your WhatsApp number
    const url =
      "https://wa.me/" +
      phone +
      "?text=" +
      encodeURIComponent("Website inquiry: " + rawText);

    messages.innerHTML +=
      `<p><strong>Silkim:</strong> This needs a deeper conversation. I’ll connect you directly.</p>`;

    window.open(url, "_blank");
  });

});
