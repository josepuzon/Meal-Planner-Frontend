import React, { useEffect } from "react";
import useMealPlanStore from "../store/mealPlanStore";

function MealPlans() {
  const { mealPlans, fetchMealPlans, generateMealPlan, removeMealPlan } =
    useMealPlanStore();

  useEffect(() => {
    fetchMealPlans();
  }, [fetchMealPlans]);

  const handleGenerate = async () => {
    const newPlan = await generateMealPlan();
    if (newPlan) alert("Meal plan generated!");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Meal Plans</h2>
      <button onClick={handleGenerate}>Generate 1-Day Meal Plan</button>

      {mealPlans.length === 0 && <p>No meal plans yet.</p>}

      {mealPlans.map((plan) => (
        <div
          key={plan.id}
          style={{
            marginTop: "2rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <h3>Meal Plan ID: {plan.id}</h3>

          {plan.meal_plan_recipes?.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {plan.meal_plan_recipes.map((mpr) => (
                <li
                  key={mpr.id}
                  style={{
                    marginBottom: "1rem",
                    padding: "0.5rem",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                  }}
                >
                  <h4>{mpr.recipe?.title || "Untitled Recipe"}</h4>
                  <p style={{ whiteSpace: "pre-line" }}>
                    {mpr.recipe?.instructions || "No instructions provided."}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recipes in this plan.</p>
          )}

          <button onClick={() => removeMealPlan(plan.id)}>
            Delete Meal Plan
          </button>
        </div>
      ))}
    </div>
  );
}

export default MealPlans;
