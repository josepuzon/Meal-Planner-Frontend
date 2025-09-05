import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import useRecipeStore from "../store/recipeStore";
import useAuthStore from "../store/useAuthStore";

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
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [fetchProfile, user?.id]);

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
      const res = await api.patch(`/users/1/meal_logs/${mealId}`, {
        meal_log: { quantity: newQuantity },
      });
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
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome,{" "}
          <span className="text-blue-400">{user?.first_name || "User"}</span>!
        </h1>
        <p className="text-gray-400">
          Manage your meals, track macros, and stay on top of your nutrition.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
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
              className="bg-gray-800 border border-gray-700 rounded-xl shadow p-4 text-center hover:bg-gray-700 transition"
            >
              <p className="font-medium text-gray-200">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Log a Meal */}
      <h2 className="text-2xl font-semibold mb-4">Log a Meal</h2>
      <div className="mb-10 bg-gray-800 border border-gray-700 p-6 rounded-xl shadow">
        <form
  onSubmit={handleSubmit}
  className="flex flex-col md:flex-row md:justify-center items-center gap-4 w-full"
>
  <div className="w-full md:w-2/5">
    <select
      value={form.recipe_id}
      onChange={(e) => setForm({ ...form, recipe_id: e.target.value })}
      required
      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select a recipe</option>
      {recipes.map((r) => (
        <option key={r.id} value={r.id}>
          {r.title}
        </option>
      ))}
    </select>
  </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })
              }
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              -
            </button>
            <span className="px-2 font-medium">{form.quantity}</span>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, quantity: form.quantity + 1 })
              }
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              +
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Log Meal
          </button>
        </form>
      </div>

      {/* Today’s Macros */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Today’s Macros</h2>
        {loading ? (
          <p className="text-gray-400">Loading macros...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Calories", value: todayMacros.calories.toFixed(0) },
              { label: "Protein", value: `${todayMacros.protein.toFixed(1)}g` },
              { label: "Carbs", value: `${todayMacros.carbs.toFixed(1)}g` },
              { label: "Fats", value: `${todayMacros.fat.toFixed(1)}g` },
            ].map((macro) => (
              <div
                key={macro.label}
                className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow text-center"
              >
                <p className="font-medium text-gray-400">{macro.label}</p>
                <p className="text-xl font-bold text-white">{macro.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meals Logged Today */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Meals Logged Today</h2>
        {loading ? (
          <p className="text-gray-400">Loading meals...</p>
        ) : todayMeals.length === 0 ? (
          <p className="text-gray-400">No meals logged today.</p>
        ) : (
          <ul className="grid gap-4">
            {todayMeals.map((meal) => (
              <li
                key={meal.id}
                className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="mb-2 md:mb-0">
                  <strong className="text-white text-lg">
                    {meal.recipe_name}
                  </strong>
                  <div className="text-gray-400 text-sm mt-1 flex gap-2 flex-wrap mb-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      Calories: {meal.macros.calories.toFixed(0)}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      Protein:{" "} {meal.macros.protein.toFixed(1)}g
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"> 
                      Carbs:{" "} {meal.macros.carbs.toFixed(1)}g
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                      Fats:{" "} {meal.macros.fat.toFixed(1)}g
                    </span>  
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdate(meal.id, meal.quantity + 1)}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      meal.quantity > 1 &&
                      handleUpdate(meal.id, meal.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="px-2 font-medium">
                    {meal.quantity} serving(s)
                  </span>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="px-3 py-1 text-red-400 hover:text-red-500"
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
