import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";

function Profile() {
  const { user, fetchProfile, updateProfile } = useAuthStore();

  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [dislikedIngredients, setDislikedIngredients] = useState([]);

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [fetchProfile, user?.id]);

  useEffect(() => {
    if (user) {
      setDietaryPreferences(user.dietary_preferences || []);
      setAllergies(user.allergies || []);
      setDislikedIngredients(user.disliked_ingredients || []);
    }
  }, [user]);

  const cleanList = (list, type) =>
    list.map((item) => {
      const isMarkedForDestroy = item._destroy || false;
      switch (type) {
        case "dietary":
          return {
            id: item.id,
            pref_name: item.pref_name || item.name,
            _destroy: isMarkedForDestroy,
          };
        case "allergy":
          return {
            id: item.id,
            allergy_name: item.allergy_name || item.name,
            _destroy: isMarkedForDestroy,
          };
        case "disliked":
          return {
            id: item.id,
            ingredient_name: item.ingredient_name || item.name,
            _destroy: isMarkedForDestroy,
          };
        default:
          return {};
      }
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      dietary_preferences_attributes: cleanList(dietaryPreferences, "dietary"),
      allergies_attributes: cleanList(allergies, "allergy"),
      disliked_ingredients_attributes: cleanList(dislikedIngredients, "disliked"),
    };

    const result = await updateProfile(profileData);

    if (result.success) alert("Profile updated!");
    else alert("Update failed: " + result.error);
  };

  const handleAdd = (setter, list) => {
    setter([...list, { name: "" }]);
  };

  const handleChange = (setter, list, index, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], name: value };
    setter(updated);
  };

  const handleRemove = (setter, list, index) => {
    const updated = [...list];
    if (updated[index].id) {
      updated[index]._destroy = true;
    } else {
      updated.splice(index, 1);
    }
    setter(updated);
  };

  if (!user) return <p>Loading profile...</p>;

  const visibleList = (list) => list.filter((item) => !item._destroy);

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
        {visibleList(dietaryPreferences).map((pref, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={pref.name || pref.pref_name || ""}
              onChange={(e) =>
                handleChange(setDietaryPreferences, dietaryPreferences, idx, e.target.value)
              }
            />
            <button type="button" onClick={() => handleRemove(setDietaryPreferences, dietaryPreferences, idx)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAdd(setDietaryPreferences, dietaryPreferences)}>
          Add Preference
        </button>

        {/* Allergies */}
        <h3>Allergies</h3>
        {visibleList(allergies).map((allergy, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={allergy.name || allergy.allergy_name || ""}
              onChange={(e) =>
                handleChange(setAllergies, allergies, idx, e.target.value)
              }
            />
            <button type="button" onClick={() => handleRemove(setAllergies, allergies, idx)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAdd(setAllergies, allergies)}>
          Add Allergy
        </button>

        {/* Disliked Ingredients */}
        <h3>Disliked Ingredients</h3>
        {visibleList(dislikedIngredients).map((item, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={item.name || item.ingredient_name || ""}
              onChange={(e) =>
                handleChange(setDislikedIngredients, dislikedIngredients, idx, e.target.value)
              }
            />
            <button type="button" onClick={() => handleRemove(setDislikedIngredients, dislikedIngredients, idx)}>
              Remove
            </button>
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
