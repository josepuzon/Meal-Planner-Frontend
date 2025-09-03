import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import useRecipeStore from "../store/recipeStore";

function Dashboard() {
  const [todayMacros, setTodayMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [todayMeals, setTodayMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ recipe_id: "", quantity: 1 });

  const { recipes, fetchRecipes } = useRecipeStore();

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const fetchTodayData = async () => {
    setLoading(true);
    try {
      const [totalsRes, mealsRes] = await Promise.all([
        api.get("/users/1/meal_logs/today_totals"),
        api.get("/users/1/meal_logs/today"),
      ]);
      setTodayMacros(totalsRes.data);
      setTodayMeals(mealsRes.data);
    } catch (err) {
      console.error("Failed to fetch today's data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/1/meal_logs", form);
      if (res.data.success) {
        await fetchTodayData();
        setForm({ recipe_id: "", quantity: 1 });
      } else {
        alert(res.data.errors.join(", "));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to log meal");
    }
  };

  const handleUpdate = async (mealId, newQuantity) => {
    try {
      const res = await api.patch(`/users/1/meal_logs/${mealId}`, { meal_log: { quantity: newQuantity } });
      if (res.data.success) {
        await fetchTodayData();
      } else {
        alert(res.data.errors.join(", "));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update meal");
    }
  };

  const handleDelete = async (mealId) => {
    try {
      await api.delete(`/users/1/meal_logs/${mealId}`);
      await fetchTodayData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete meal");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome back!</h1>
      <p>This is your dashboard. From here, you can manage your meals, pantry, and track progress.</p>

      <div style={{ marginTop: "20px" }}>
        <h2>Quick Actions</h2>
        <ul>
          <li><Link to="/meal-plans">View Meal Plans</Link></li>
          <li><Link to="/recipes">Explore Recipes</Link></li>
          <li><Link to="/profile">Edit Profile</Link></li>
          <li><Link to="/pantry">Manage Pantry</Link></li>
        </ul>
      </div>

      {/* Log a Meal */}
      <div style={{ marginTop: "40px" }}>
        <h2>Log a Meal</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={form.recipe_id}
            onChange={(e) => setForm({ ...form, recipe_id: e.target.value })}
            required
          >
            <option value="">Select a recipe</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
            >
              -
            </button>
            <span>{form.quantity}</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
            >
              +
            </button>
          </div>

          <button type="submit" style={{ marginLeft: "10px" }}>Log Meal</button>
        </form>
      </div>

      {/* Today’s Overview */}
      <div style={{ marginTop: "40px" }}>
        <h2>Today’s Overview</h2>
        {loading ? (
          <p>Loading macros...</p>
        ) : (
          <>
            <p>Calories: {todayMacros.calories.toFixed(0)}</p>
            <p>Proteins: {todayMacros.protein.toFixed(1)}g</p>
            <p>Carbs: {todayMacros.carbs.toFixed(1)}g</p>
            <p>Fats: {todayMacros.fat.toFixed(1)}g</p>
          </>
        )}
      </div>

      {/* Meals Logged Today */}
      <div style={{ marginTop: "40px" }}>
        <h2>Meals Logged Today</h2>
        {loading ? (
          <p>Loading meals...</p>
        ) : todayMeals.length === 0 ? (
          <p>No meals logged today.</p>
        ) : (
          <ul>
            {todayMeals.map((meal) => (
              <li key={meal.id} style={{ marginBottom: "10px" }}>
                <strong>{meal.recipe_name}</strong>
                <button
                  onClick={() => handleUpdate(meal.id, meal.quantity + 1)}
                  style={{ marginLeft: "10px" }}
                >
                  +
                </button>
                <button
                  onClick={() => meal.quantity > 1 && handleUpdate(meal.id, meal.quantity - 1)}
                  style={{ marginLeft: "5px" }}
                >
                  -
                </button>
                <span style={{ marginLeft: "5px" }}>{meal.quantity} serving(s)</span>
                <button
                  onClick={() => handleDelete(meal.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Remove
                </button>
                <div>
                  Calories: {meal.macros.calories.toFixed(0)}, 
                  Proteins: {meal.macros.protein.toFixed(1)}g, 
                  Carbs: {meal.macros.carbs.toFixed(1)}g, 
                  Fats: {meal.macros.fat.toFixed(1)}g
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
