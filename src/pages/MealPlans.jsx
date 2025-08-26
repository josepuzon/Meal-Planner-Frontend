import React, { useState } from "react";
import useMealPlanStore from "../store/mealPlanStore";
import useRecipeStore from "../store/recipeStore";

function MealPlans() {
  const { mealPlans, addMealPlan, removeMealPlan } = useMealPlanStore();
  const { recipes } = useRecipeStore();

  const [name, setName] = useState("");
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) return;

    const selectedRecipes = recipes.filter((r) =>
      selectedRecipeIds.includes(r.id.toString())
    );

    addMealPlan({
      id: Date.now(),
      name,
      recipes: selectedRecipes,
    });

    setName("");
    setSelectedRecipeIds([]);
  };

  const toggleRecipeSelection = (id) => {
    setSelectedRecipeIds((prev) =>
      prev.includes(id.toString())
        ? prev.filter((rid) => rid !== id.toString())
        : [...prev, id.toString()]
    );
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Meal Plans</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Meal Plan Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <h4>Select Recipes:</h4>
        {recipes.length === 0 && <p>No recipes available. Add some first!</p>}
        {recipes.map((r) => (
          <label key={r.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedRecipeIds.includes(r.id.toString())}
              onChange={() => toggleRecipeSelection(r.id)}
            />
            {r.title}
          </label>
        ))}

        <button type="submit">Add Meal Plan</button>
      </form>

      <ul>
        {mealPlans.map((m) => (
          <li key={m.id}>
            <strong>{m.name}</strong>
            <ul>
              {m.recipes.map((r) => (
                <li key={r.id}>{r.title}</li>
              ))}
            </ul>
            <button onClick={() => removeMealPlan(m.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MealPlans;