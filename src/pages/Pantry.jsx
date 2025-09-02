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

  const calculateCalories = (ingredient, quantity) => {
    if (!ingredient) return 0;
    return Math.round(
      quantity *
        ((ingredient.protein_per_gram * 4) +
         (ingredient.carbs_per_gram * 4) +
         (ingredient.fat_per_gram * 9))
    );
  };

  return (
    <div className="container mt-4">
      <h2>Pantry</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAdd} className="d-flex gap-2 my-3">
        <input
          className="form-control"
          placeholder="Ingredient name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          className="form-control"
          placeholder="Unit (g, ml, pcs...)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <button className="btn btn-success">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-group">
          {items.map((item) => (
            <li key={item.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>{item.name}</strong>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
              {item.ingredient && (
                <small className="text-muted">
                  {Math.round(item.quantity)} {item.unit} →
                  {calculateCalories(item.ingredient, item.quantity)} kcal |
                  P: {Math.round(item.quantity * item.ingredient.protein_per_gram)} g |
                  C: {Math.round(item.quantity * item.ingredient.carbs_per_gram)} g |
                  F: {Math.round(item.quantity * item.ingredient.fat_per_gram)} g
                </small>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Pantry;
