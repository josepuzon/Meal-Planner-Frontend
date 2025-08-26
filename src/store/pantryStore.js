import { create } from "zustand";

const usePantryStore = create((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({ items: [...state.items, { id: Date.now(), ...item }] })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}));

export default usePantryStore;
