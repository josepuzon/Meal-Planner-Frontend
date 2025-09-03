import React, { useState, useEffect } from "react";
import useRecipeStore from "../store/recipeStore";

function Recipes() {
  const {
    recipes,
    selectedRecipe,
    fetchRecipes,
    fetchRecipe,
    addRecipe,
    deleteRecipe,
  } = useRecipeStore();

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addRecipe({ title, instructions });
    setTitle("");
    setInstructions("");
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recipes</h2>

      {/* Add new recipe */}
      <form
        onSubmit={handleAdd}
        className="mb-8 flex flex-col md:flex-row items-center gap-3"
      >
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Recipe
        </button>
      </form>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column: recipe list */}
        <div className="md:w-1/3 bg-white rounded shadow border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">All Recipes</h3>
          {recipes.length === 0 ? (
            <p className="text-gray-500">No recipes yet.</p>
          ) : (
            <ul className="space-y-2">
              {recipes.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-100 transition cursor-pointer"
                >
                  <span onClick={() => fetchRecipe(r.id)} className="text-gray-800">
                    {r.title}
                  </span>
                  <button
                    onClick={() => deleteRecipe(r.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right column: selected recipe details */}
        <div className="md:w-2/3">
          {selectedRecipe ? (
            <div className="p-6 bg-white shadow rounded border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedRecipe.title}
              </h3>

              {/* Ingredients */}
              {selectedRecipe.ingredients?.length > 0 ? (
                <div className="mb-4">
                  <strong className="text-gray-700">Ingredients:</strong>
                  <ul className="list-disc list-inside text-gray-600 ml-2 mt-1">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>
                          {ing.ingredient_name}{" "}
                          {ing.quantity && `${ing.quantity} ${ing.unit || ""}`}
                        </span>
                        {ing.total_calories && (
                          <span className="text-sm text-gray-500">
                            {ing.total_calories.toFixed(1)} cal
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">No ingredients provided.</p>
              )}

              {/* Instructions */}
              <p className="text-gray-700 whitespace-pre-line">
                {selectedRecipe.instructions || "No instructions provided."}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Select a recipe to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
