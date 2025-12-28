document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     UI INJECTION
     ===================================================== */

  const chatbotHTML = `
    <div id="chatButton">💬</div>

    <div id="chatbot">
      <div id="chatHeader">Ask Silkim</div>
      <div id="chatMessages">
        <p><strong>Silkim:</strong> Hello. You can ask about journeys, seasons, difficulty, or preparation.</p>
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
     SOCIAL / GENERAL RESPONSES
     ===================================================== */

  const greetings = ["hi", "hello", "hey", "good morning", "good evening"];

  const smallTalk = {
    "how are you": "I’m doing well, thank you. How are you?",
    "how are you doing": "I’m doing well, thank you. How are you?",
    "who are you":
      "I’m Silkim’s travel assistant. I help you understand journeys, seasons, and preparation.",
    "what do you do":
      "I help with information about Silkim journeys — routes, seasons, difficulty, and preparation.",
    "help":
      "You can ask about destinations like Ladakh, Sikkim, or Bhutan, or about seasons, difficulty, and planning.",
    "thank you":
      "You’re welcome. Let me know if you’d like to explore a journey further.",
    "thanks":
      "You’re welcome. Feel free to ask anything else."
  };

  /* =====================================================
     KNOWLEDGE BASE
     ===================================================== */

  const knowledge = {
    sikkim: {
      altitude:
        "Sikkim journeys range from about 1,200 m to 4,200 m, with gradual ascents through forested and alpine terrain.",
      season:
        "The best seasons for Sikkim are March–June and September–November, offering stable weather and clear access.",
      difficulty:
        "Sikkim routes are generally moderate and well-suited for first-time Himalayan travelers.",
      duration:
        "Sikkim journeys typically last 8–12 days, allowing cultural immersion and acclimatization.",
      overview:
        "Sikkim journeys emphasize monasteries, forest belts, and alpine valleys, paced slowly and thoughtfully.",
      convenience:
        "Sikkim is one of the most convenient Himalayan journeys, with good road access and lower altitude stress."
    },

    ladakh: {
      altitude:
        "Ladakh journeys operate between 3,200 m and 5,200 m, requiring careful acclimatization.",
      season:
        "Ladakh is accessible mainly from June to September, when high passes open.",
      difficulty:
        "Ladakh is the most demanding due to sustained high altitude and exposure.",
      duration:
        "Ladakh journeys usually span 10–14 days to allow safe altitude adaptation.",
      overview:
        "Ladakh routes follow historic trade corridors across high plateaus and remote valleys.",
      convenience:
        "Ladakh is less convenient due to altitude and remoteness, best for prepared travelers."
    },

    bhutan: {
      altitude:
        "Bhutan journeys range from river valleys to passes around 4,500 m, with gentle elevation gain.",
      season:
        "The best seasons for Bhutan are March–May and September–November.",
      difficulty:
        "Bhutan routes are moderate, focusing on cultural depth rather than physical challenge.",
      duration:
        "Bhutan journeys typically last 10–14 days for a slow, immersive experience.",
      overview:
        "Bhutan journeys focus on interior valleys, monasteries, and community-based travel.",
      convenience:
        "Bhutan is logistically smooth but regulated, with stable infrastructure."
    }
  };

  const comparisons = {
    difficulty:
      "Among the journeys, Ladakh is the most challenging due to altitude. Bhutan is moderate, while Sikkim is the most accessible.",
    convenience:
      "Sikkim is generally the most convenient, followed by Bhutan. Ladakh requires the most preparation."
  };

  const packing = {
    youth:
      "For youth journeys, bring layered clothing, comfortable walking shoes, a warm jacket, sunscreen, personal medication, a reusable bottle, and a small daypack.",
    general:
      "All journeys require layered clothing, sun protection, comfortable footwear, and readiness for slow travel."
  };

  /* =====================================================
     DETECTION LOGIC
     ===================================================== */

  const destinations = ["sikkim", "ladakh", "bhutan"];

  const topics = {
    altitude: ["altitude", "height", "elevation"],
    season: ["season", "best time", "when"],
    difficulty: ["difficulty", "hard", "easy", "challenging"],
    duration: ["duration", "days", "how long"],
    convenience: ["convenient", "easy to travel", "access"],
    overview: ["journey", "route", "trip"],
    compare: ["more difficult", "which is harder", "compare"],
    packing: ["bring", "pack", "carry"],
    youth: ["youth", "young", "students"]
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
    return null;
  }

  function needsHuman(text) {
    const triggers = [
      "custom",
      "itinerary",
      "design",
      "private",
      "family",
      "dates",
      "permit",
      "medical",
      "price"
    ];
    return triggers.some(t => text.includes(t));
  }

  /* =====================================================
     SUGGESTIONS
     ===================================================== */

  function getSuggestions(destination) {
    return [
      `Best season for ${capitalize(destination)}?`,
      `Altitude levels in ${capitalize(destination)} journey?`,
      `Difficulty of ${capitalize(destination)} route?`,
      `How many days are ideal for ${capitalize(destination)}?`,
      `Is ${capitalize(destination)} convenient for first-timers?`
    ];
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

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
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

    messages.innerHTML +=
      `<p><strong>You:</strong> ${rawText}</p>`;

    /* ---- Greetings ---- */
    if (greetings.includes(text)) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> Hello. How can I help you today?</p>`;
      return;
    }

    /* ---- Small talk ---- */
    for (const key in smallTalk) {
      if (text.includes(key)) {
        messages.innerHTML +=
          `<p><strong>Silkim:</strong> ${smallTalk[key]}</p>`;
        return;
      }
    }

    /* ---- Comparisons ---- */
    if (text.includes("more difficult") || text.includes("which is harder")) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${comparisons.difficulty}</p>`;
      return;
    }

    /* ---- Packing / youth ---- */
    if (text.includes("bring") || text.includes("pack") || text.includes("youth")) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${packing.youth}</p>`;
      return;
    }

    /* ---- Destination-specific ---- */
    const destination = detectDestination(text);
    const topic = detectTopic(text);

    if (destination && !needsHuman(text)) {
      const reply =
        knowledge[destination][topic] ||
        knowledge[destination].overview;

      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${reply}</p>`;

      renderSuggestions(getSuggestions(destination));
    } else {
      const phone = "917029066906"; // replace with your WhatsApp number
      const url =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent("Website inquiry: " + rawText);

      messages.innerHTML +=
        `<p><strong>Silkim:</strong> This needs a deeper conversation. I’ll connect you directly.</p>`;

      window.open(url, "_blank");
    }

    messages.scrollTop = messages.scrollHeight;
  });

});
