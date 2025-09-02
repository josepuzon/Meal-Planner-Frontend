// src/store/pantryStore.js
import { create } from "zustand";
import api from "../api/axios";
import useAuthStore from "./useAuthStore";

const usePantryStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const res = await api.get(`/users/${user.id}/pantry_items`);
      set({ items: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch pantry items",
        loading: false,
      });
    }
  },

  addItem: async (item) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const res = await api.post(`/users/${user.id}/pantry_items`, {
        pantry_item: item,
      });
      set((state) => ({ items: [...state.items, res.data] }));
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to add pantry item" });
    }
  },

  updateItem: async (id, updates) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const res = await api.put(`/users/${user.id}/pantry_items/${id}`, {
        pantry_item: updates,
      });
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? res.data : item)),
      }));
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to update pantry item",
      });
    }
  },

  removeItem: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      await api.delete(`/users/${user.id}/pantry_items/${id}`);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to remove pantry item",
      });
    }
  },
}));

export default usePantryStore;
