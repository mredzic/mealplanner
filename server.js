import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS: Allow your frontend to access the backend
app.use(
  cors({
    origin: "*",  // 🚀 Temporarily allow ALL origins (for debugging)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("Meal Planner API is running!");
});

// ✅ Fix API Route (Ensure `async` is used correctly)
app.post("/api/mealplan", async (req, res) => {
  const { diet, allergies, mealTypes, cookingTime, ingredients } = req.body;

  try { 
  const apiKey = process.env.OPENAI_API_KEY;
console.log("Using OpenAI API Key:", apiKey);  // ✅ Debugging key being used

const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "You are a meal planning assistant..." },
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

    if (!gptData.choices || gptData.choices.length === 0) {
      console.error("Unexpected OpenAI Response:", gptData);
      return res.status(500).json({ reply: "Error: OpenAI returned an unexpected response." });
    }

    const rawText = gptData.choices[0].message.content;
    console.log("📝 Raw OpenAI Response:", rawText); // ✅ Debugging log

    const mealPlanIndex = rawText.indexOf("### Weekly Meal Plan");
const groceryListIndex = rawText.indexOf("### Grocery List");

let mealPlanText = "Meal plan not found.";
let groceryListText = "Grocery list not found.";

if (mealPlanIndex !== -1 && groceryListIndex !== -1) {
    mealPlanText = rawText.substring(mealPlanIndex, groceryListIndex).replace("### Weekly Meal Plan", "").trim();
    groceryListText = rawText.substring(groceryListIndex).replace("### Grocery List", "").trim();
} else {
    console.error("Error: Could not properly separate meal plan and grocery list.");
}

    if (mealPlanIndex !== -1 && groceryListIndex !== -1) {
        mealPlanText = rawText.substring(mealPlanIndex, groceryListIndex).trim();
        groceryListText = rawText.substring(groceryListIndex).replace("### Grocery List", "").trim();
    } else {
        console.error("🚨 Error: Could not properly separate meal plan and grocery list.");
    }

    res.json({ mealPlan: mealPlanText, groceryList: groceryListText });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Server error: Unable to process request." });
  }
});

// ✅ Ensure server runs on correct port
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));