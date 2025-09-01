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

          {/* Start and End Date */}
          <p>
            <strong>Start Date:</strong>{" "}
            {plan.start_date
              ? new Date(plan.start_date).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {plan.end_date
              ? new Date(plan.end_date).toLocaleDateString()
              : "N/A"}
          </p>

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

                  {/* Ingredients */}
                  {mpr.recipe?.recipe_ingredients?.length > 0 ? (
                    <div>
                      <strong>Ingredients:</strong>
                      <ul>
                        {mpr.recipe.recipe_ingredients.map((ri) => (
                          <li key={ri.id}>
                            {ri.quantity} {ri.unit}{" "}
                            {ri.ingredient?.ingredient_name ||
                              "Unnamed ingredient"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No ingredients provided.</p>
                  )}

                  {/* Instructions */}
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
