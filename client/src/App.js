import React from "react";
import MealPlanner from "./MealPlanner"; // Import MealPlanner component

const App = () => {
  return (
    <div className="container">
      <h1>Meal Planner</h1>
      <MealPlanner /> {/* Use the component instead of hardcoding fields */}
    </div>
  );
};

export default App;