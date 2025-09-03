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
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-600">Manage your meals, track macros, and stay on top of your nutrition.</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "View Meal Plans", to: "/meal-plans" },
            { label: "Explore Recipes", to: "/recipes" },
            { label: "Edit Profile", to: "/profile" },
            { label: "Manage Pantry", to: "/pantry" },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="bg-white rounded-lg shadow p-4 text-center hover:bg-blue-50 transition"
            >
              <p className="font-medium text-gray-800">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Log a Meal */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Log a Meal</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <select
            value={form.recipe_id}
            onChange={(e) => setForm({ ...form, recipe_id: e.target.value })}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a recipe</option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })
              }
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="px-2 font-medium">{form.quantity}</span>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, quantity: form.quantity + 1 })
              }
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-400 transition"
          >
            Log Meal
          </button>
        </form>
      </div>

      {/* Today’s Macros */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Today’s Macros</h2>
        {loading ? (
          <p>Loading macros...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Calories", value: todayMacros.calories.toFixed(0) },
              { label: "Proteins", value: `${todayMacros.protein.toFixed(1)}g` },
              { label: "Carbs", value: `${todayMacros.carbs.toFixed(1)}g` },
              { label: "Fats", value: `${todayMacros.fat.toFixed(1)}g` },
            ].map((macro) => (
              <div
                key={macro.label}
                className="bg-white p-4 rounded-lg shadow text-center"
              >
                <p className="font-medium text-gray-700">{macro.label}</p>
                <p className="text-xl font-bold">{macro.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meals Logged Today */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Meals Logged Today</h2>
        {loading ? (
          <p>Loading meals...</p>
        ) : todayMeals.length === 0 ? (
          <p>No meals logged today.</p>
        ) : (
          <ul className="grid gap-4">
            {todayMeals.map((meal) => (
              <li
                key={meal.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="mb-2 md:mb-0">
                  <strong className="text-gray-800 text-lg">{meal.recipe_name}</strong>
                  <div className="text-gray-600 text-sm mt-1">
                    Calories: {meal.macros.calories.toFixed(0)}, Proteins:{" "}
                    {meal.macros.protein.toFixed(1)}g, Carbs: {meal.macros.carbs.toFixed(1)}g, Fats:{" "}
                    {meal.macros.fat.toFixed(1)}g
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdate(meal.id, meal.quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      meal.quantity > 1 && handleUpdate(meal.id, meal.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-2 font-medium">{meal.quantity} serving(s)</span>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="px-3 py-1 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
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
