import React, { useState } from "react";

const MealPlanner = () => {
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mealPlan, setMealPlan] = useState(null);
  const [groceryList, setGroceryList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customAllergy, setCustomAllergy] = useState("");

  const API_URL = "https://mealplanner-silk.vercel.app/";

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diet,
          allergies: customAllergy ? [...allergies, customAllergy] : allergies,
          mealTypes,
          cookingTime,
          ingredients,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();

      setMealPlan(data.mealPlan || "No meal plan available.");
      setGroceryList(data.groceryList || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Meal Planner</h2>
<div className="form-container">
  {/* Diet Preference */}
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

  {/* Allergies */}
  <div>
    <label>Allergies:</label>
    <select value={allergies} onChange={(e) => setAllergies(e.target.value)}>
      <option value="">None</option>
      <option value="Peanuts">Peanuts</option>
      <option value="Gluten">Gluten</option>
      <option value="Dairy">Dairy</option>
      <option value="Other">Other (please specify)</option>
    </select>
  </div>

  {/* Meal Types */}
  <div>
    <label>Meal Types:</label>
    <div>
      <input type="checkbox" value="Breakfast" /> Breakfast
      <input type="checkbox" value="Lunch" /> Lunch
      <input type="checkbox" value="Dinner" /> Dinner
    </div>
  </div>

  {/* Cooking Time */}
  <div>
    <label>Cooking Time:</label>
    <select value={cookingTime} onChange={(e) => setCookingTime(e.target.value)}>
      <option value="Standard">Standard</option>
      <option value="30min">30 minutes or less</option>
      <option value="15min">15 minutes or less</option>
    </select>
  </div>

  <button onClick={handleSubmit}>Generate Meal Plan</button>
</div>

      {/* ✅ Meal Plan Output */}
      {mealPlan && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Meal Plan:</h2>
          {mealPlan}
        </div>
      )}

      {/* ✅ Grocery List Output */}
      {groceryList && groceryList.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Grocery List:</h2>
          <ul className="list-disc pl-4">
            {groceryList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;