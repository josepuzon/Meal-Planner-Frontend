import { create } from "zustand";

const useUserStore = create((set) => ({
  user: {
    id: null,
    name: "",
    email: "",
    token: null,
    preferences: [],
    allergies: [],
    dislikes: [],
  },
  setUser: (user) => set({ user }),
  updateProfile: (updates) =>
    set((state) => ({ user: { ...state.user, ...updates } })),
  logout: () => set({ user: null }),
}));

export default useUserStore;
