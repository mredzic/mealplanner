import { useState } from "react";
import { FaUtensils, FaCoffee, FaHamburger, FaAppleAlt } from "react-icons/fa"; // Import icons

const MealPlanner = () => {
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mealPlan, setMealPlan] = useState(null);
  const [groceryList, setGroceryList] = useState(null);
  const [loading, setLoading] = useState(false);

 const handleSubmit = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5002/api/mealplan", {
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
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Meal Planner</h2>

      <div className="space-y-6">
        {/* Diet Preference */}
        <div>
          <label className="block font-medium mb-2">Diet Preference:</label>
          <select
            className="w-full border p-3 rounded"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
          </select>
        </div>

        {/* Allergies */}
        <div>
          <label className="block font-medium mb-2">Allergies:</label>
          <input
            type="text"
            className="w-full border p-3 rounded"
            placeholder="E.g., Nut-free, Dairy-free"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value.split(","))}
          />
        </div>

        {/* Meal Types with Icons */}
        <div>
          <label className="block font-medium mb-2">Meal Types:</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`flex items-center justify-center p-3 rounded border transition ${
                mealTypes.includes("Breakfast") ? "bg-blue-100 border-blue-500" : "bg-gray-100"
              }`}
              onClick={() =>
                setMealTypes((prev) =>
                  prev.includes("Breakfast") ? prev.filter((t) => t !== "Breakfast") : [...prev, "Breakfast"]
                )
              }
            >
              <FaCoffee className="mr-2 text-xl" />
              Breakfast
            </button>

            <button
              className={`flex items-center justify-center p-3 rounded border transition ${
                mealTypes.includes("Lunch") ? "bg-blue-100 border-blue-500" : "bg-gray-100"
              }`}
              onClick={() =>
                setMealTypes((prev) =>
                  prev.includes("Lunch") ? prev.filter((t) => t !== "Lunch") : [...prev, "Lunch"]
                )
              }
            >
              <FaUtensils className="mr-2 text-xl" />
              Lunch
            </button>

            <button
              className={`flex items-center justify-center p-3 rounded border transition ${
                mealTypes.includes("Dinner") ? "bg-blue-100 border-blue-500" : "bg-gray-100"
              }`}
              onClick={() =>
                setMealTypes((prev) =>
                  prev.includes("Dinner") ? prev.filter((t) => t !== "Dinner") : [...prev, "Dinner"]
                )
              }
            >
              <FaHamburger className="mr-2 text-xl" />
              Dinner
            </button>

            <button
              className={`flex items-center justify-center p-3 rounded border transition ${
                mealTypes.includes("Snacks") ? "bg-blue-100 border-blue-500" : "bg-gray-100"
              }`}
              onClick={() =>
                setMealTypes((prev) =>
                  prev.includes("Snacks") ? prev.filter((t) => t !== "Snacks") : [...prev, "Snacks"]
                )
              }
            >
              <FaAppleAlt className="mr-2 text-xl" />
              Snacks
            </button>
          </div>
        </div>

        {/* Cooking Time */}
        <div>
          <label className="block font-medium mb-2">Cooking Time:</label>
          <select
            className="w-full border p-3 rounded"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Quick">Quick (&lt;30 min)</option>
            <option value="Standard">Standard</option>
            <option value="Batch">Batch Cooking</option>
          </select>
        </div>

        {/* Available Ingredients */}
        <div>
          <label className="block font-medium mb-2">Available Ingredients:</label>
          <input
            type="text"
            className="w-full border p-3 rounded"
            placeholder="E.g., Chicken, Rice, Carrots"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded w-full mt-4 text-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Meal Plan"}
          </button>
        </div>
      </div>

      {/* Meal Plan Display */}
      {mealPlan && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg mb-2">Meal Plan:</h3>
          {mealPlan}
        </div>
      )}

      {/* Grocery List Display */}
      {groceryList && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg mb-2">Grocery List:</h3>
          <ul className="list-disc pl-5">{groceryList}</ul>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;