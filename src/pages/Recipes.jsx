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
    <div style={{ padding: "1rem" }}>
      <h2>Recipes</h2>

      {/* Add new recipe */}
      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <br />
        <button type="submit">Add Recipe</button>
      </form>

      {/* List of recipes */}
      {recipes.length === 0 ? (
        <p>No recipes yet.</p>
      ) : (
        <ul>
          {recipes.map((r) => (
            <li key={r.id}>
              <strong>{r.title}</strong>{" "}
              <button onClick={() => fetchRecipe(r.id)}>View</button>{" "}
              <button onClick={() => deleteRecipe(r.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {/* Selected recipe details */}
      {selectedRecipe && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h3>{selectedRecipe.title}</h3>

          {/* Ingredients */}
          {selectedRecipe.ingredients?.length > 0 ? (
            <div>
              <strong>Ingredients:</strong>
              <ul>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.ingredient_name}{" "}
                    {ing.quantity && `${ing.quantity} ${ing.unit || ""}`}{" "}
                    {ing.total_calories
                      ? `(${ing.total_calories.toFixed(1)} cal)`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No ingredients provided.</p>
          )}

          {/* Instructions */}
          <p style={{ whiteSpace: "pre-line" }}>
            {selectedRecipe.instructions || "No instructions provided."}
          </p>
        </div>
      )}
    </div>
  );
}

export default Recipes;
