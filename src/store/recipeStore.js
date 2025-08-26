import { create } from "zustand";

const useRecipeStore = create((set) => ({
  recipes: [],
  addRecipe: (recipe) =>
    set((state) => ({ recipes: [...state.recipes, recipe] })),
  removeRecipe: (id) =>
    set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) })),
}));

export default useRecipeStore;
