const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCYHCKHUOt0FFUjZYxiMeQHere6lMvnT8A");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });