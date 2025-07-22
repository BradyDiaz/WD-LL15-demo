const responseBox = document.getElementById("response");
let isBusy = false;

document.getElementById("wouldYouBtn").addEventListener("click", () => handleClick("would you rather"));
document.getElementById("iceBtn").addEventListener("click", () => handleClick("icebreaker"));
document.getElementById("factBtn").addEventListener("click", () => handleClick("weird fact"));
document.getElementById("jokeBtn").addEventListener("click", () => handleClick("joke"));
document.getElementById("weatherBtn").addEventListener("click", () => handleClick("weather prompt"));

async function handleClick(type) {
  if (isBusy) return;
  isBusy = true;
  disableButtons(true);
  responseBox.textContent = "Loading... 🔄";

  const contextInput = document.getElementById("contextInput");
  const context = contextInput ? contextInput.value.trim() : "";

  let basePrompt;
  switch (type) {
    case "icebreaker":
      basePrompt = "Give me a fun, friendly conversation starter anyone can answer.";
      break;
    case "weird fact":
      basePrompt = "Tell me a surprising or weird fact that most people don’t know.";
      break;
    case "joke":
      basePrompt = "Tell me a short, light, and clean joke.";
      break;
    case "weather prompt":
      basePrompt = "Ask a question that gets people talking about the weather in their area.";
      break;
    case "would you rather":
      basePrompt = "Give me a fun, clean, ‘Would You Rather’ question that works in a group setting.";
      break;
    default:
      responseBox.textContent = "❌ Unknown button type.";
      isBusy = false;
      disableButtons(false);
      return;
  }

  const fullPrompt = context
    ? `${basePrompt} The context is: ${context}`
    : basePrompt;

  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.7
      })
    });

    if (!result.ok) throw new Error(`HTTP error: ${result.status}`);

    const data = await result.json();
    const reply = data.choices[0].message.content.trim();
    await typeText(reply);

  } catch (error) {
    console.error("Error:", error);
    responseBox.textContent = "😓 Something went wrong. Try again in a moment!";
  }

  isBusy = false;
  disableButtons(false);
}

function typeText(text) {
  return new Promise((resolve) => {
    responseBox.textContent = "";
    let index = 0;
    const speed = 20;

    const interval = setInterval(() => {
      if (index < text.length) {
        responseBox.textContent += text.charAt(index++);
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function disableButtons(disable) {
  const buttons = document.querySelectorAll("#icebreaker-buttons button");
  buttons.forEach((btn) => btn.disabled = disable);
}
