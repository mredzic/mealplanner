import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ FIX: Update CORS to allow requests from your frontend
app.use(
  cors({
    origin: ["https://mealplanner-silk.vercel.app", "https://mealplanner-git-main-merimas-projects.vercel.app"], // ✅ Allow both URLs
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Meal Planner API is running!");
});

// ✅ Ensure this is properly set for your API route
app.post("/api/mealplan", async (req, res) => {
  res.json({ message: "Meal plan API is working!" });
});
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
          {
            role: "system",
            content:
              "You are a meal planning assistant. Generate a structured weekly meal plan along with a separate grocery list...",
          },
          {
            role: "user",
            content: `Diet: ${diet}, Allergies: ${allergies}, Meal Types: ${mealTypes}, Cooking Time: ${cookingTime}, Ingredients: ${ingredients}.`,
          },
        ],
        max_tokens: 700,
      }),
    });

    const gptData = await gptResponse.json();
    if (gptData.error) {
      return res.status(500).json({ reply: `OpenAI Error: ${gptData.error.message}` });
    }

    const rawText = gptData.choices[0].message.content;
    const mealPlanIndex = rawText.indexOf("### Meal Plan");
    const groceryListIndex = rawText.indexOf("### Grocery List");

    let mealPlanText = "Meal plan not found.";
    let groceryListText = "Grocery list not found.";

    if (mealPlanIndex !== -1 && groceryListIndex !== -1) {
      mealPlanText = rawText.substring(mealPlanIndex, groceryListIndex).trim();
      groceryListText = rawText.substring(groceryListIndex).replace("### Grocery List", "").trim();
    }

    res.json({
      mealPlan: mealPlanText,
      groceryList: groceryListText,
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Server error: Unable to process request." });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));