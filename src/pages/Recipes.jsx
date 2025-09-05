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
  const [ingredients, setIngredients] = useState([
    { ingredient_name: "", quantity: "", unit: "" },
  ]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient_name: "", quantity: "", unit: "" }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRecipe({
      title,
      instructions,
      recipe_ingredients: ingredients.filter((ing) => ing.ingredient_name.trim()),
    });

    setTitle("");
    setInstructions("");
    setIngredients([{ ingredient_name: "", quantity: "", unit: "" }]);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Recipes</h2>

      {/* Add new recipe */}
      <form
        onSubmit={handleAdd}
        className="mb-8 flex flex-col gap-4 bg-gray-800 p-6 rounded-xl shadow border border-gray-700"
      >
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="px-3 py-2 border border-gray-600 rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Ingredients */}
        <div>
          <strong className="text-gray-300">Ingredients</strong>
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Name"
                value={ing.ingredient_name}
                onChange={(e) =>
                  handleIngredientChange(index, "ingredient_name", e.target.value)
                }
                className="px-2 py-1 border border-gray-600 rounded bg-gray-800 text-gray-100 w-1/2"
              />
              <input
                type="number"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                className="px-2 py-1 border border-gray-600 rounded bg-gray-800 text-gray-100 w-1/4"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                className="px-2 py-1 border border-gray-600 rounded bg-gray-800 text-gray-100 w-1/4"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="mt-2 text-blue-400 hover:underline"
          >
            + Add Ingredient
          </button>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          Add Recipe
        </button>
      </form>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Recipe list */}
        <div className="md:w-1/3 bg-gray-800 rounded-xl shadow border border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-4">All Recipes</h3>
          {recipes.length === 0 ? (
            <p className="text-gray-400">No recipes yet.</p>
          ) : (
            <ul className="space-y-2">
              {recipes.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-700 transition cursor-pointer"
                >
                  <span onClick={() => fetchRecipe(r.id)} className="text-gray-100">
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

        {/* Selected recipe */}
        <div className="md:w-2/3">
          {selectedRecipe ? (
            <div className="p-6 bg-gray-800 shadow rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">{selectedRecipe.title}</h3>

              {selectedRecipe.ingredients?.length > 0 ? (
                <div className="mb-4">
                  <strong className="text-gray-300">Ingredients:</strong>
                  <ul className="list-disc list-inside text-gray-300 ml-2 mt-1">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        {ing.quantity && `${ing.quantity} ${ing.unit || ""} `}
                        {ing.ingredient_name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-400">No ingredients provided.</p>
              )}

              <p className="text-gray-300 whitespace-pre-line">
                {selectedRecipe.instructions || "No instructions provided."}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">Select a recipe to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recipes;
