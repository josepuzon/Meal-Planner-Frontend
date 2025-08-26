import { useState } from "react";
import useUserStore from "../store/userStore";

function Profile() {
  const { user, updateProfile } = useUserStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [preferences, setPreferences] = useState(user?.preferences || []);
  const [allergies, setAllergies] = useState(user?.allergies || []);
  const [dislikes, setDislikes] = useState(user?.dislikes || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, email, preferences, allergies, dislikes });
    alert("✅ Profile updated (in store for now)");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Details */}
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="border p-2 w-full bg-gray-100 cursor-not-allowed"
          />
          <p className="text-sm text-gray-500">
            Email can’t be changed right now
          </p>
        </div>

        {/* Dietary Preferences */}
        <div>
          <label className="block font-semibold">Dietary Preferences</label>
          <input
            type="text"
            value={preferences.join(", ")}
            onChange={(e) => setPreferences(e.target.value.split(",").map(p => p.trim()))}
            className="border p-2 w-full"
            placeholder="e.g. vegan, keto"
          />
        </div>

        {/* Allergies */}
        <div>
          <label className="block font-semibold">Allergies</label>
          <input
            type="text"
            value={allergies.join(", ")}
            onChange={(e) => setAllergies(e.target.value.split(",").map(a => a.trim()))}
            className="border p-2 w-full"
            placeholder="e.g. peanuts, dairy"
          />
        </div>

        {/* Disliked Ingredients */}
        <div>
          <label className="block font-semibold">Disliked Ingredients</label>
          <input
            type="text"
            value={dislikes.join(", ")}
            onChange={(e) => setDislikes(e.target.value.split(",").map(d => d.trim()))}
            className="border p-2 w-full"
            placeholder="e.g. mushrooms, onions"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;