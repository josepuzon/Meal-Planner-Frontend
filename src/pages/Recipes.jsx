import React, { useState } from "react";
import useRecipeStore from "../store/recipeStore";

function Recipes() {
  const { recipes, addRecipe, removeRecipe } = useRecipeStore();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    addRecipe({
      id: Date.now(),
      title,
      instructions,
    });
    setTitle("");
    setInstructions("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Recipes</h2>
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

      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong>
            <p>{r.instructions}</p>
            <button onClick={() => removeRecipe(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recipes;