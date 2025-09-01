import { create } from "zustand";
import api from "../api/axios";
import useAuthStore from "./useAuthStore";

const useRecipeStore = create((set) => ({
  recipes: [],
  selectedRecipe: null,

  fetchRecipes: async () => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    try {
      const res = await api.get("/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API /recipes response:", res.data);

      // unwrap Rails response
      const recipes = res.data?.data?.recipes || [];
      set({ recipes });
    } catch (err) {
      console.error("Fetch recipes failed:", err.response?.data || err.message);
    }
  },

  fetchRecipe: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    try {
      const res = await api.get(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API /recipes/:id response:", res.data);

      const recipe = res.data?.data?.recipe || {};
      recipe.ingredients = recipe.ingredients || [];
      set({ selectedRecipe: recipe });
    } catch (err) {
      console.error("Fetch recipe failed:", err.response?.data || err.message);
    }
  },

  addRecipe: async (recipe) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    try {
      const res = await api.post(
        "/api/v1/recipes",
        { recipe },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API add recipe response:", res.data);

      const newRecipe = res.data?.data?.recipe;
      if (newRecipe) {
        set((state) => ({ recipes: [...state.recipes, newRecipe] }));
      }
    } catch (err) {
      console.error("Add recipe failed:", err.response?.data || err.message);
    }
  },

  deleteRecipe: async (id) => {
    const { token } = useAuthStore.getState();
    if (!token) return;

    try {
      await api.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        recipes: state.recipes.filter((r) => r.id !== id),
        selectedRecipe:
          state.selectedRecipe?.id === id ? null : state.selectedRecipe,
      }));
    } catch (err) {
      console.error("Delete recipe failed:", err.response?.data || err.message);
    }
  },
}));

export default useRecipeStore;
