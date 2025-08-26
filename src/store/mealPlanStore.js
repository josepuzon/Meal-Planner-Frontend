import { create } from "zustand";

const useMealPlanStore = create((set) => ({
  mealPlans: [],
  addMealPlan: (mealPlan) =>
    set((state) => ({ mealPlans: [...state.mealPlans, mealPlan] })),
  removeMealPlan: (id) =>
    set((state) => ({
      mealPlans: state.mealPlans.filter((m) => m.id !== id),
    })),
}));

export default useMealPlanStore;
