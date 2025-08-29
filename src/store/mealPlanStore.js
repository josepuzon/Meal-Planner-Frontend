import { create } from "zustand";
import api from "../api/axios";
import useAuthStore from "./useAuthStore";

const useMealPlanStore = create((set) => ({
  mealPlans: [],

  fetchMealPlans: async () => {
    const { user, token } = useAuthStore.getState();
    if (!user) return;

    try {
      const res = await api.get(`/users/${user.id}/meal_plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ mealPlans: res.data });
    } catch (err) {
      console.error(
        "Fetch meal plans failed:",
        err.response?.data || err.message
      );
    }
  },

  generateMealPlan: async () => {
    const { user, token } = useAuthStore.getState();
    if (!user) return;

    try {
      const res = await api.post(
        `/users/${user.id}/meal_plans/generate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newPlan = res.data;
      set((state) => ({ mealPlans: [...state.mealPlans, newPlan] }));
      return newPlan;
    } catch (err) {
      console.error(
        "Generate meal plan failed:",
        err.response?.data || err.message
      );
      return null;
    }
  },

  removeMealPlan: async (id) => {
    const { user, token } = useAuthStore.getState();
    if (!user) return;

    try {
      await api.delete(`/users/${user.id}/meal_plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        mealPlans: state.mealPlans.filter((m) => m.id !== id),
      }));
    } catch (err) {
      console.error(
        "Delete meal plan failed:",
        err.response?.data || err.message
      );
    }
  },
}));

export default useMealPlanStore;
