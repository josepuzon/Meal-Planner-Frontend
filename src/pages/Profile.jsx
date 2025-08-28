import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

function Profile() {
  const { user, fetchProfile, updateProfile } = useAuthStore();

  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [dislikedIngredients, setDislikedIngredients] = useState([]);

  // Load from backend into form state
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [fetchProfile, user?.id]);

  useEffect(() => {
    if (user) {
      setDietaryPreferences(user.dietary_preferences || []);
      setAllergies(user.allergies || []);
      setDislikedIngredients(user.disliked_ingredients || []);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      dietary_preferences: dietaryPreferences,
      allergies,
      disliked_ingredients: dislikedIngredients,
    };

    const result = await updateProfile(profileData);

    if (result.success) {
      alert("Profile updated!");
    } else {
      alert("Update failed: " + result.error);
    }
  };

  // Helpers to add/remove items
  const handleAdd = (setter, list) => {
    setter([...list, { name: "" }]);
  };

  const handleChange = (setter, list, index, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], name: value };
    setter(updated);
  };

  const handleRemove = (setter, list, index) => {
    const updated = list.filter((_, i) => i !== index);
    setter(updated);
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>
        Name: {user.first_name} {user.last_name}
      </p>
      <p>Email: {user.email}</p>

      <form onSubmit={handleSubmit}>
        {/* Dietary Preferences */}
        <h3>Dietary Preferences</h3>
        {dietaryPreferences.map((pref, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={pref.name || pref.pref_name || ""}
              onChange={(e) =>
                handleChange(setDietaryPreferences, dietaryPreferences, idx, e.target.value)
              }
            />
            <button type="button" onClick={() => handleRemove(setDietaryPreferences, dietaryPreferences, idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAdd(setDietaryPreferences, dietaryPreferences)}>
          Add Preference
        </button>

        {/* Allergies */}
        <h3>Allergies</h3>
        {allergies.map((allergy, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={allergy.name || allergy.allergy_name || ""}
              onChange={(e) =>
                handleChange(setAllergies, allergies, idx, e.target.value)
              }
            />
            <button type="button" onClick={() => handleRemove(setAllergies, allergies, idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAdd(setAllergies, allergies)}>
          Add Allergy
        </button>

        {/* Disliked Ingredients */}
        <h3>Disliked Ingredients</h3>
        {dislikedIngredients.map((item, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={item.name || item.ingredient_name || ""}
              onChange={(e) =>
                handleChange(setDislikedIngredients, dislikedIngredients, idx, e.target.value)
              }
            />
            <button type="button" onClick={() => handleRemove(setDislikedIngredients, dislikedIngredients, idx)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAdd(setDislikedIngredients, dislikedIngredients)}>
          Add Ingredient
        </button>

        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Profile;
