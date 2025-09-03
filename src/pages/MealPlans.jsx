import React, { useEffect, useState } from "react";
import useMealPlanStore from "../store/mealPlanStore";
import api from "../api/axios";
import useRecipeStore from "../store/recipeStore";

function MealPlans() {
  const { mealPlans, fetchMealPlans, generateMealPlan, removeMealPlan } =
    useMealPlanStore();

  const [recipesMap, setRecipesMap] = useState({});
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const { recipes, fetchRecipes } = useRecipeStore();

  // fetch meal plans
  useEffect(() => {
    fetchMealPlans();
  }, [fetchMealPlans]);

  // fetch recipes for meal plans
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoadingRecipes(true);
      try {
        const res = await api.get("/recipes");
        const map = {};
        res.data.forEach((recipe) => {
          map[recipe.id] = recipe;
        });
        setRecipesMap(map);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleGenerate = async () => {
    const newPlan = await generateMealPlan();
    if (newPlan) alert("Meal plan generated!");
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Meal Plans</h2>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Generate 1-Day Meal Plan
        </button>
      </div>

      {mealPlans.length === 0 && (
        <p className="text-gray-500">No meal plans yet.</p>
      )}

      {mealPlans.map((plan) => (
        <div
          key={plan.id}
          className="mt-6 p-4 bg-white shadow-lg rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Meal Plan ID: {plan.id}
          </h3>

          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
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
          </div>

          {plan.meal_plan_recipes?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {plan.meal_plan_recipes.map((mpr) => {
                const recipe = recipesMap[mpr.recipe_id] || mpr.recipe;

                // calculate macros if recipe exists
                const macros = recipe?.recipe_ingredients?.reduce((acc, ri) => {
                  const ing = ri.ingredient;
                  if (!ing) return acc;

                  const quantity = ri.quantity || 1;
                  const weight = ing.serving_weight_grams || 1;

                  return {
                      calories: acc.calories + (ing.calories_per_gram * weight * quantity),
                      protein: acc.protein + (ing.protein_per_gram * weight * quantity),
                      carbs: acc.carbs + (ing.carbs_per_gram * weight * quantity),
                      fat: acc.fat + (ing.fat_per_gram * weight * quantity),
                  };
                }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

                return (
                  <div
                    key={mpr.id}
                    className="p-4 bg-gray-50 rounded shadow-sm border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {recipe?.title || "Untitled Recipe"}
                      </h4>

                      {/* Macros display */}
                      {macros && (
                        <div className="flex gap-2 flex-wrap mb-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                            Calories: {macros.calories.toFixed(0)}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            Protein: {macros.protein.toFixed(1)}g
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            Carbs: {macros.carbs.toFixed(1)}g
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                            Fat: {macros.fat.toFixed(1)}g
                          </span>
                        </div>
                      )}

                      {/* Ingredients */}
                      {recipe?.recipe_ingredients?.length > 0 ? (
                        <div className="mb-2">
                          <strong className="text-gray-700">Ingredients:</strong>
                          <ul className="list-disc list-inside text-gray-600 ml-2">
                            {recipe.recipe_ingredients.map((ri) => (
                              <li key={ri.id}>
                                {ri.quantity} {ri.unit}{" "}
                                {ri.ingredient?.ingredient_name ||
                                  "Unnamed ingredient"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-gray-500">No ingredients provided.</p>
                      )}

                      {/* Instructions */}
                      <p className="text-gray-600 whitespace-pre-line mt-2">
                        {recipe?.instructions || "No instructions provided."}
                      </p>
                    </div>

                    <button
                      onClick={() => removeMealPlan(plan.id)}
                      className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition self-start"
                    >
                      Delete Meal Plan
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No recipes in this plan.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default MealPlans;
