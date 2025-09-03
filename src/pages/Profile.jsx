import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

function CategoryCard({ title, list, setter, type, color }) {
  const visibleList = list.filter(item => !item._destroy);

  const handleAdd = () => setter([...list, { name: "" }]);

  const handleRemove = (idx) => {
    const updated = [...list];
    if (updated[idx].id) updated[idx]._destroy = true;
    else updated.splice(idx, 1);
    setter(updated);
  };

  const handleChange = (idx, value) => {
    const updated = [...list];
    const key =
      type === "dietary" ? "pref_name" :
      type === "allergy" ? "allergy_name" :
      type === "disliked" ? "ingredient_name" : "name";

    updated[idx] = { ...updated[idx], [key]: value };
    setter(updated);
  };

  return (
    <div className="bg-white rounded shadow p-6 flex flex-col gap-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {visibleList.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1 px-3 py-1 ${color.bg} ${color.text} rounded-full`}
          >
            <input
              type="text"
              value={
                item.name ||
                item.pref_name ||
                item.allergy_name ||
                item.ingredient_name
              }
              onChange={(e) => handleChange(idx, e.target.value)}
              className="bg-transparent focus:outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className={`font-bold ${color.textHover}`}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className={`px-3 py-1 rounded-full text-sm text-white ${color.addBg} hover:${color.addHover} transition`}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

function Profile() {
  const { user, fetchProfile, updateProfile, healthGoals, fetchHealthGoals } = useAuthStore();

  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [dislikedIngredients, setDislikedIngredients] = useState([]);
  const [formData, setFormData] = useState({ health_goal_id: "" });

  useEffect(() => {
    if (user?.id) fetchProfile();
    fetchHealthGoals();
  }, [fetchProfile, fetchHealthGoals, user?.id]);

  useEffect(() => {
    if (user) {
      setDietaryPreferences(user.dietary_preferences || []);
      setAllergies(user.allergies || []);
      setDislikedIngredients(user.disliked_ingredients || []);
      setFormData({ health_goal_id: user.health_goal_id || "" });
    }
  }, [user]);

  const cleanList = (list, type) =>
    list.map((item) => ({
      id: item.id,
      _destroy: item._destroy || false,
      ...(type === "dietary" ? { pref_name: item.pref_name || item.name } : {}),
      ...(type === "allergy" ? { allergy_name: item.allergy_name || item.name } : {}),
      ...(type === "disliked" ? { ingredient_name: item.ingredient_name || item.name } : {}),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = {
      dietary_preferences_attributes: cleanList(dietaryPreferences, "dietary"),
      allergies_attributes: cleanList(allergies, "allergy"),
      disliked_ingredients_attributes: cleanList(dislikedIngredients, "disliked"),
      health_goal_id: formData.health_goal_id,
    };
    const result = await updateProfile(profileData);
    alert(result.success ? "Profile updated!" : "Update failed: " + result.error);
  };

  if (!user) return <p className="text-gray-500">Loading profile...</p>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>

      {/* Top Cards: Personal Info & Health & Preferences */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Personal Info Card */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-semibold mb-5">Personal Information</h3>
          <p className="mb-5"><span className="font-semibold text-gray-700">First Name:</span> {user.first_name}</p>
          <p className="mb-5"><span className="font-semibold text-gray-700">Last Name:</span> {user.last_name}</p>
          <p className="mb-5"><span className="font-semibold text-gray-700">Email:</span> {user.email}</p>
        </div>

        {/* Health & Preferences Card */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-semibold mb-3">Health & Preferences</h3>

          {/* Health Goal */}
          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Health Goal:</p>
            <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold">
              {healthGoals?.find(h => h.id === formData.health_goal_id)?.goal_name || "Not set"}
            </span>
          </div>

          {/* Dietary Preferences */}
          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Dietary Preferences:</p>
            <div className="flex flex-wrap gap-3">
              {dietaryPreferences.filter(p => !p._destroy).length
                ? dietaryPreferences.filter(p => !p._destroy).map((p, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm font-semibold"
                    >
                      {p.name || p.pref_name}
                    </span>
                  ))
                : <span className="text-gray-500">None</span>}
            </div>
          </div>

          {/* Allergies */}
          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-1">Allergies:</p>
            <div className="flex flex-wrap gap-3">
              {allergies.filter(a => !a._destroy).length
                ? allergies.filter(a => !a._destroy).map((a, idx) => (
                    <span
                      key={idx}
                      className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg text-sm font-semibold"
                    >
                      {a.name || a.allergy_name}
                    </span>
                  ))
                : <span className="text-gray-500">None</span>}
            </div>
          </div>

          {/* Disliked Ingredients */}
          <div>
            <p className="font-semibold text-gray-700 mb-1">Disliked Ingredients:</p>
            <div className="flex flex-wrap gap-3">
              {dislikedIngredients.filter(d => !d._destroy).length
                ? dislikedIngredients.filter(d => !d._destroy).map((d, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-semibold"
                    >
                      {d.name || d.ingredient_name}
                    </span>
                  ))
                : <span className="text-gray-500">None</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Health Goal Card */}
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Health Goal</h3>
          <select
            value={formData.health_goal_id || ""}
            onChange={(e) => setFormData({ ...formData, health_goal_id: e.target.value })}
            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a health goal</option>
            {(healthGoals || []).map((goal) => (
              <option key={goal.id} value={goal.id}>{goal.goal_name}</option>
            ))}
          </select>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <CategoryCard
            title="Dietary Preferences"
            list={dietaryPreferences}
            setter={setDietaryPreferences}
            type="dietary"
            color={{ bg: "bg-green-100", text: "text-green-800", textHover: "text-green-900", addBg: "bg-green-500", addHover: "bg-green-600" }}
          />
          <CategoryCard
            title="Allergies"
            list={allergies}
            setter={setAllergies}
            type="allergy"
            color={{ bg: "bg-red-100", text: "text-red-800", textHover: "text-red-900", addBg: "bg-red-500", addHover: "bg-red-600" }}
          />
          <CategoryCard
            title="Disliked Ingredients"
            list={dislikedIngredients}
            setter={setDislikedIngredients}
            type="disliked"
            color={{ bg: "bg-gray-200", text: "text-gray-800", textHover: "text-gray-900", addBg: "bg-gray-500", addHover: "bg-gray-600" }}
          />
        </div>

        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
