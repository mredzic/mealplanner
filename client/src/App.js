import { useState } from "react";

const App = () => {
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState("");
  const [mealTypes, setMealTypes] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/api/mealplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diet, allergies, mealTypes, cookingTime, ingredients }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setMealPlan(data.mealPlan);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      setMealPlan("Failed to fetch meal plan. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Meal Planner</h1>

      <label>Diet:</label>
      <input type="text" value={diet} onChange={(e) => setDiet(e.target.value)} />

      <label>Allergies:</label>
      <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />

      <label>Meal Types:</label>
      <input type="text" value={mealTypes} onChange={(e) => setMealTypes(e.target.value)} />

      <label>Cooking Time:</label>
      <input type="text" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />

      <label>Ingredients:</label>
      <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Generating..." : "Generate Meal Plan"}
      </button>

      {mealPlan && <div><h2>Meal Plan:</h2><p>{mealPlan}</p></div>}
    </div>
  );
};

export default App;