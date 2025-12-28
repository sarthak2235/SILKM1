document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     UI INJECTION
     ===================================================== */

  const chatbotHTML = `
    <div id="chatButton">💬</div>

    <div id="chatbot">
      <div id="chatHeader">Ask Silkim</div>
      <div id="chatMessages">
        <p><strong>Silkim:</strong> Ask about destinations, seasons, difficulty, or preparation.</p>
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
     KNOWLEDGE BASE
     ===================================================== */

  const knowledge = {
    sikkim: {
      altitude:
        "Sikkim journeys range from about 1,200 m to 4,200 m, with gradual ascents through forested and alpine terrain.",
      season:
        "The best seasons for Sikkim are March–June and September–November, offering stable weather and clear access.",
      difficulty:
        "Sikkim routes are generally moderate, well-suited for first-time Himalayan travelers.",
      duration:
        "Sikkim journeys typically last 8–12 days, allowing cultural immersion and acclimatization.",
      overview:
        "Sikkim journeys emphasize monasteries, forest belts, and alpine valleys, paced slowly and thoughtfully.",
      convenience:
        "Sikkim is one of the more convenient Himalayan journeys, with good road access and lower altitude stress."
    },

    ladakh: {
      altitude:
        "Ladakh journeys operate between 3,200 m and 5,200 m, requiring careful acclimatization.",
      season:
        "Ladakh is accessible mainly from June to September, when high passes open.",
      difficulty:
        "Ladakh is the most physically demanding due to sustained high altitude and exposure.",
      duration:
        "Ladakh journeys usually span 10–14 days to allow safe altitude adaptation.",
      overview:
        "Ladakh routes follow historic trade corridors across high plateaus and remote valleys.",
      convenience:
        "Ladakh is less convenient due to altitude and remoteness, best suited for experienced or prepared travelers."
    },

    bhutan: {
      altitude:
        "Bhutan journeys range from river valleys to passes around 4,500 m, with gentle elevation gain.",
      season:
        "The best seasons for Bhutan are March–May and September–November.",
      difficulty:
        "Bhutan routes are moderate, focusing more on cultural depth than physical challenge.",
      duration:
        "Bhutan journeys typically last 10–14 days for a slow, immersive experience.",
      overview:
        "Bhutan journeys focus on interior valleys, monasteries, and community-based travel.",
      convenience:
        "Bhutan is logistically smooth but regulated, with structured travel and stable infrastructure."
    }
  };

  /* =====================================================
     COMPARATIVE & PRACTICAL KNOWLEDGE
     ===================================================== */

  const comparisons = {
    difficulty:
      "Among Silkim journeys, Ladakh is the most challenging due to sustained high altitude. Bhutan is moderate, while Sikkim is the most accessible and beginner-friendly.",
    convenience:
      "Sikkim is generally the most convenient, followed by Bhutan. Ladakh requires the most preparation due to altitude and remoteness."
  };

  const packing = {
    youth:
      "For youth journeys, essentials include layered clothing, sturdy walking shoes, a warm jacket, sunscreen, reusable water bottles, personal medication, and a small daypack. Physical fitness matters more than heavy gear.",
    general:
      "All journeys require layered clothing, sun protection, comfortable footwear, and a mindset prepared for slow travel."
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
    overview: ["journey", "route", "trip", "overview"],
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
    return "overview";
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

    const userTextRaw = input.value.trim();
    const userText = userTextRaw.toLowerCase();
    input.value = "";
    clearSuggestions();

    messages.innerHTML +=
      `<p><strong>You:</strong> ${userTextRaw}</p>`;

    const destination = detectDestination(userText);
    const topic = detectTopic(userText);

    /* ---- Comparative questions ---- */
    if (topic === "compare" || userText.includes("more difficult")) {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${comparisons.difficulty}</p>`;
      return;
    }

    /* ---- Packing / youth questions ---- */
    if (topic === "packing" || topic === "youth") {
      messages.innerHTML +=
        `<p><strong>Silkim:</strong> ${packing.youth}</p>`;
      return;
    }

    /* ---- Destination-specific ---- */
    if (destination && !needsHuman(userText)) {
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
        encodeURIComponent("Website inquiry: " + userTextRaw);

      messages.innerHTML +=
        `<p><strong>Silkim:</strong> This needs a deeper conversation. I’ll connect you directly.</p>`;

      window.open(url, "_blank");
    }

    messages.scrollTop = messages.scrollHeight;
  });

});
