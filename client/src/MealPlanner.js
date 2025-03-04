import { useState } from "react";

const MealPlanner = () => {
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mealPlan, setMealPlan] = useState(null);
  const [groceryList, setGroceryList] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = "https://mealplanner-silk.vercel.app/"; 

 const handleSubmit = async () => {
  setLoading(true);
  try {
     const res = await fetch(API_URL, { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diet,
        allergies,
        mealTypes,
        cookingTime,
        ingredients,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();

    // ✅ Ensure meal plan is structured properly
    const formattedMealPlan = data.mealPlan
      ? data.mealPlan.split("\n\n").map((section, index) => <p key={index} className="mb-2">{section}</p>)
      : [<p key="no-plan">No meal plan available.</p>];

    // ✅ Ensure grocery list is correctly extracted
    let rawGroceryText = data.groceryList || "";

    // ✅ Remove non-grocery list text (headers, instructions)
    rawGroceryText = rawGroceryText
      .split("\n")
      .map((item) => item.trim())
      .filter(
        (item) =>
          item.length > 2 &&
          !item.includes("Meal Plan") &&
          !item.includes("###") &&
          !item.startsWith("Here's") &&
          !item.toLowerCase().includes("instructions") &&
          !item.toLowerCase().includes("serve with") &&
          !item.toLowerCase().includes("dressing")
      );

    // ✅ If grocery list is still empty, show fallback message
    const groceryItems =
      rawGroceryText.length > 0
        ? rawGroceryText.map((item, index) => <li key={index}>{item}</li>)
        : [<li key="no-items">No grocery list available.</li>];

    // ✅ Ensure state updates are inside the try block and properly closed
    setMealPlan(formattedMealPlan);
    setGroceryList(groceryItems);

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch meal plan. Please try again.");
  } finally {
    setLoading(false); // ✅ Ensure loading state is reset
  }
};

 return (
    <div>
      <label>Diet Preference:</label>
      <select value={diet} onChange={(e) => setDiet(e.target.value)}>
        <option value="">Select...</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Vegan">Vegan</option>
        <option value="Keto">Keto</option>
        <option value="Paleo">Paleo</option>
      </select>
    </div>

    <div>
      <label>Meal Types:</label>
      <input type="checkbox" value="Breakfast" /> Breakfast
      <input type="checkbox" value="Lunch" /> Lunch
      <input type="checkbox" value="Dinner" /> Dinner
    </div>

    <div>
      <label>Cooking Time:</label>
      <select>
        <option value="Standard">Standard</option>
        <option value="30min">30 minutes or less</option>
      </select>
    </div>

    <button onClick={handleSubmit}>Generate Meal Plan</button>
  </div>
);
export default MealPlanner;