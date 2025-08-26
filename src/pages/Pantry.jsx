import { useState } from "react";
import usePantryStore from "../store/pantryStore";

function Pantry() {
  const { items, addItem, removeItem } = usePantryStore();
  const [name, setName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) return;
    addItem({ name });
    setName("");
  };

  return (
    <div className="container mt-4">
      <h2>Pantry</h2>
      <form onSubmit={handleAdd} className="d-flex gap-2 my-3">
        <input
          className="form-control"
          placeholder="Add item..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-success">Add</button>
      </form>

      <ul className="list-group">
        {items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            {item.name}
            <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pantry;
