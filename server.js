import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // ✅ Loads environment variables

const app = express();

// ✅ Allow frontend acc
app.use(
  cors({
    origin: ["https://mealplanner-7ejki14l3-merimas-projects.vercel.app"], // Add your deployed frontend URL here
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure headers are allowed
    credentials: false, // Set to false if you don't need cookies/auth sessions
  })
);

app.use(express.json());

// ✅ API Health Check
app.get("/", (req, res) => {
  res.send("Meal Planner API is running!");
});

app.use((req, res, next) => {
  console.log("Request received from:", req.headers["user-agent"]);
  next();
});

// ✅ Meal Plan API Route
app.post("/api/mealplan", async (req, res) => {
  const { diet, allergies, mealTypes, cookingTime, ingredients } = req.body;

  try {

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a meal planner assistant. Generate a structured weekly meal plan with a separate grocery list." },
          { role: "user", content: `Diet: ${diet}, Allergies: ${allergies}, Meal Types: ${mealTypes}, Cooking Time: ${cookingTime}, Ingredients: ${ingredients}.` },
        ],
        max_tokens: 700,
      }),
    });

    const gptData = await gptResponse.json();

    if (gptData.error) {
      console.error("OpenAI Error:", gptData.error);
      return res.status(500).json({ reply: `OpenAI Error: ${gptData.error.message}` });
    }

    const rawText = gptData.choices?.[0]?.message?.content || "Error: No response from OpenAI";
    console.log("Raw OpenAI Response:", rawText);

    res.json({ mealPlan: rawText });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Server error: Unable to process request." });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));