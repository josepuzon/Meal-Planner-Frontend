import React, { useEffect, useState } from "react";
import useMealPlanStore from "../store/mealPlanStore";
import api from "../api/axios";
import useRecipeStore from "../store/recipeStore";

function MealPlans() {
  const { mealPlans, fetchMealPlans, generateMealPlan, removeMealPlan } =
    useMealPlanStore();

  const [recipesMap, setRecipesMap] = useState({});
  const { fetchRecipes } = useRecipeStore();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [generating, setGenerating] = useState(false);

  // fetch meal plans
  useEffect(() => {
    fetchMealPlans();
  }, [fetchMealPlans]);

  // fetch recipes
  useEffect(() => {
    const fetchRecipesData = async () => {
      try {
        const res = await api.get("/recipes");
        const recipeArray = Array.isArray(res.data)
          ? res.data
          : res.data.recipes || [];
        const map = {};
        recipeArray.forEach((recipe) => {
          map[recipe.id] = recipe;
        });
        setRecipesMap(map);
      } catch (err) {
        console.error("Failed to fetch recipes:", err, err.response?.data);
      }
    };

    fetchRecipesData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true); // start loader
    try {
      const newPlan = await generateMealPlan();
      if (newPlan) alert("Meal plan generated!");
    } catch (err) {
      console.error(err);
      alert("Failed to generate meal plan.");
    } finally {
      setGenerating(false); // stop loader
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-gray-100 relative">
      {/* FULL-PAGE OVERLAY LOADER */}
      {generating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl flex flex-col items-center">
            <div className="loader mb-4 w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            <p className="text-white text-lg font-semibold">
              Generating meal plan...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Meal Plans</h2>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`px-4 py-2 bg-blue-600 text-white rounded transition ${
            generating ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-500"
          }`}
        >
          Generate 1-Day Meal Plan
        </button>
      </div>

      {/* Empty state */}
      {mealPlans.length === 0 && (
        <p className="text-gray-400">No meal plans yet.</p>
      )}

      {/* Meal Plan Cards */}
      {mealPlans.map((plan) => (
        <div
          key={plan.id}
          className="mt-6 p-4 bg-gray-800 shadow rounded-lg border border-gray-700 flex justify-between items-center"
        >
          <h3 className="text-lg font-semibold">{`Meal Plan #${plan.id}`}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPlan(plan)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              View Details
            </button>
            <button
              onClick={() => removeMealPlan(plan.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] flex flex-col relative text-gray-100">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-lg"
            >
              ✕
            </button>

            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold">{`Meal Plan #${selectedPlan.id}`}</h3>
              <div className="flex flex-wrap gap-4 text-gray-300 mt-2">
                <p>
                  <strong>Start Date:</strong>{" "}
                  {selectedPlan.start_date
                    ? new Date(selectedPlan.start_date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {selectedPlan.end_date
                    ? new Date(selectedPlan.end_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {selectedPlan.meal_plan_recipes?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedPlan.meal_plan_recipes.map((mpr) => {
                    const recipe = recipesMap[mpr.recipe_id] || mpr.recipe;

                    return (
                      <div
                        key={mpr.id}
                        className="p-4 bg-gray-700 rounded shadow border border-gray-600"
                      >
                        <h4 className="font-semibold mb-2">
                          {recipe?.title || "Untitled Recipe"}
                        </h4>

                        {recipe?.recipe_ingredients?.length > 0 ? (
                          <div className="mb-2">
                            <strong>Ingredients:</strong>
                            <ul className="list-disc list-inside ml-2 text-gray-300">
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
                          <p className="text-gray-400">No ingredients provided.</p>
                        )}

                        <p className="whitespace-pre-line mt-2 text-gray-300">
                          {recipe?.instructions || "No instructions provided."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 mt-2">No recipes in this plan.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlans;
