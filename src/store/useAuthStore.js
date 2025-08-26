import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: async (credentials) => {
    try {
      const res = await api.post("/login", credentials);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      set({ user, token });
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  },

  register: async (data) => {
    try {
      const res = await api.post("/register", data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      set({ user, token });
      return { success: true };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        error: err.response?.data?.error || "Register failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
