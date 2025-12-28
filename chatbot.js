document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CHATBOT UI INJECTION
     ===================================================== */

  const chatbotHTML = `
    <div id="chatButton">💬</div>

    <div id="chatbot">
      <div id="chatHeader">Ask Silkim</div>
      <div id="chatMessages">
        <p><strong>Silkim:</strong> Ask about Bhutan, Ladakh, Sikkim, seasons, or journeys.</p>
      </div>
      <div id="chatSuggestions"></div>
      <input id="chatInput" placeholder="Type your question and press Enter…" />
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
     KNOWLEDGE BASE (STATIC INTELLIGENCE)
     ===================================================== */

  const knowledge = [
    {
      tag: "bhutan",
      keywords: ["bhutan"],
      answer:
        "Bhutan journeys focus on interior valleys, monasteries, and slow elevation gain. Routes are shaped by cultural calendars and seasonal clarity.",
      suggestions: [
        "Best season for Bhutan travel?",
        "Difficulty level of Bhutan Interior journey?",
        "How many days are ideal for Bhutan?"
      ]
    },
    {
      tag: "ladakh",
      keywords: ["ladakh"],
      answer:
        "Ladakh journeys traverse high plateaus and historic trade corridors. Acclimatization and seasonality are critical design factors.",
      suggestions: [
        "Best time to travel to Ladakh?",
        "How difficult is Ladakh Traverse?",
        "Is acclimatization included?"
      ]
    },
    {
      tag: "sikkim",
      keywords: ["sikkim"],
      answer:
        "Sikkim routes emphasize monasteries, forest belts, and alpine valleys. Journeys are paced slowly to match terrain and climate.",
      suggestions: [
        "Best season for Sikkim?",
        "Cultural highlights of Sikkim route?",
        "Altitude levels in Sikkim journey?"
      ]
    },
    {
      tag: "season",
      keywords: ["season", "best time", "when"],
      answer:
        "Season determines access, weather stability, and safety. Each Silkim journey operates only within narrow seasonal windows.",
      suggestions: [
        "Best season for Ladakh?",
        "When is Bhutan accessible?",
        "Monsoon impact on journeys?"
      ]
    },
    {
      tag: "difficulty",
      keywords: ["difficulty", "fitness", "hard", "easy"],
      answer:
        "Difficulty depends on altitude, terrain, and remoteness. Journeys prioritize gradual pacing over physical intensity.",
      suggestions: [
        "Is Ladakh suitable for beginners?",
        "Fitness needed for Bhutan?",
        "How acclimatization works?"
      ]
    },
    {
      tag: "journey",
      keywords: ["journey", "trip", "route", "expedition"],
      answer:
        "Silkim journeys are terrain-led, not checklist-driven. Routes respond to geography, seasons, and time rather than speed.",
      suggestions: [
        "How journeys are designed?",
        "Custom journeys possible?",
        "Difference between routes?"
      ]
    },
    {
      tag: "price",
      keywords: ["price", "cost", "budget", "pricing"],
      answer:
        "Pricing varies by region, duration, season, and logistics. Each journey is custom-designed rather than packaged.",
      suggestions: [
        "What affects journey cost?",
        "Group vs private pricing?",
        "Inclusions in pricing?"
      ]
    }
  ];

  /* =====================================================
     HELPERS
     ===================================================== */

  function matchIntent(text) {
    const lower = text.toLowerCase();
    return knowledge.find(k =>
      k.keywords.some(word => lower.includes(word))
    );
  }

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

  function needsHuman(text) {
    const triggers = [
      "custom",
      "design",
      "itinerary",
      "dates",
      "family",
      "private",
      "permit",
      "medical"
    ];
    return triggers.some(t => text.toLowerCase().includes(t));
  }

  /* =====================================================
     INPUT HANDLER
     ===================================================== */

  input.addEventListener("keydown", e => {
    if (e.key !== "Enter" || input.value.trim() === "") return;

    const userText = input.value.trim();
    input.value = "";
    clearSuggestions();

    messages.innerHTML +=
      `<p><strong>You:</strong> ${userText}</p>`;

    const intent = matchIntent(userText);

    if (intent && !needsHuman(userText)) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${intent.answer}</p>`;
      renderSuggestions(intent.suggestions);
    } else {
      const phone = "91XXXXXXXXXX"; // replace with your WhatsApp number
      const url =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent("Website inquiry: " + userText);

      messages.innerHTML +=
        `<p><strong>Silkim:</strong> This requires a deeper conversation. I’ll connect you directly.</p>`;

      window.open(url, "_blank");
    }

    messages.scrollTop = messages.scrollHeight;
  });

});
