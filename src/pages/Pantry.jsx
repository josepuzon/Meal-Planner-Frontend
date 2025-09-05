import { useState, useEffect } from "react";
import usePantryStore from "../store/pantryStore";

function Pantry() {
  const { items, fetchItems, addItem, removeItem, loading, error } = usePantryStore();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !quantity || !unit) return;
    addItem({ name, quantity, unit });
    setName("");
    setQuantity("");
    setUnit("");
  };

  const calculateMacros = (ingredient, quantity) => {
    if (!ingredient) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return {
      calories: Math.round(quantity * ((ingredient.protein_per_gram + ingredient.carbs_per_gram) * 4 + ingredient.fat_per_gram * 9)),
      protein: Math.round(quantity * ingredient.protein_per_gram),
      carbs: Math.round(quantity * ingredient.carbs_per_gram),
      fat: Math.round(quantity * ingredient.fat_per_gram),
    };
  };

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Pantry</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Add item form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col md:flex-row items-center gap-3 mb-6 bg-gray-800 p-6 rounded-xl shadow border border-gray-700"
      >
        <input
          className="px-3 py-2 border border-gray-600 rounded w-full md:w-1/4 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingredient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="px-3 py-2 border border-gray-600 rounded w-full md:w-1/6 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="px-3 py-2 border border-gray-600 rounded w-full md:w-1/6 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Unit (g)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition">
          Add
        </button>
      </form>

      {/* Pantry items list */}
      {loading ? (
        <p className="text-gray-400">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">No items in your pantry yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const macros = calculateMacros(item.ingredient, item.quantity);
            return (
              <li
                key={item.id}
                className="p-4 bg-gray-800 rounded-xl shadow border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-gray-100">{item.name}</strong>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
                {item.ingredient && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                    <span>
                      Quantity: {Math.round(item.quantity)} {item.unit}
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Calories: {macros.calories} kcal
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                      Protein: {macros.protein} g
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      Carbs: {macros.carbs} g
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                      Fats: {macros.fat} g
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Pantry;
