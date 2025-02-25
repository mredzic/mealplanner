import express from "express";
import cors from "cors";  // ✅ Import CORS once
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const app = express();

// ✅ Apply Middleware (CORS & JSON Parsing)
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend access

// ✅ Test Route to Confirm Server is Running
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// ✅ Chatbot API Route (POST Request)
app.post("/api/mealplan", async (req, res) => {
    const { diet, allergies, mealTypes, cookingTime, ingredients } = req.body;

    try {
        const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a meal planning assistant. Generate a structured weekly meal plan along with a separate grocery list. " +
                            "The grocery list must contain all the ingredients needed for the meals, categorized into sections like Vegetables, Grains, Proteins, Dairy, and Pantry Items. " +
                            "Ensure the response is clearly divided using '### Meal Plan' and '### Grocery List' to separate the two sections."
                    },
                    {
                        role: "user",
                        content: `Diet: ${diet}, Allergies: ${allergies}, Meal Types: ${mealTypes}, Cooking Time: ${cookingTime}, Ingredients: ${ingredients}.`
                    },
                ],
                max_tokens: 700, // ✅ Ensure enough tokens for a full response
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
        console.log("Raw OpenAI Response:", rawText); // ✅ Log raw output

        // ✅ Extract meal plan and grocery list
        const mealPlanIndex = rawText.indexOf("### Meal Plan");
        const groceryListIndex = rawText.indexOf("### Grocery List");

        let mealPlanText = "Meal plan not found.";
        let groceryListText = "Grocery list not found.";

        if (mealPlanIndex !== -1 && groceryListIndex !== -1) {
            mealPlanText = rawText.substring(mealPlanIndex, groceryListIndex).trim();
            groceryListText = rawText.substring(groceryListIndex).replace("### Grocery List", "").trim();
        } else {
            console.error("Error: Could not properly separate meal plan and grocery list.");
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
// ✅ Start Server on Port 5002
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));