import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  // 🔹 LOGIN
  login: async (credentials) => {
    try {
      const payload = {
        user: {
          email: credentials.email,
          password: credentials.password,
        },
      };

      const res = await api.post("/login", payload); // ⬅️ removed withCredentials

      const { status } = res.data;

      if (status?.code === 200) {
        set({ user: status.data, token: status.token });
        localStorage.setItem("token", status.token);
        return { success: true };
      }

      return {
        success: false,
        error: status?.message || "Login failed",
      };
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.status?.message || "Login failed",
      };
    }
  },

  // 🔹 REGISTER
  register: async (payload) => {
    try {
      const res = await api.post("/signup", payload, { withCredentials: true });
      const { status } = res.data;

      if (status?.code === 200) {
        set({ user: status.data, token: status.token });
        localStorage.setItem("token", status.token);
        return { success: true };
      }

      return {
        success: false,
        error: status?.message || "Registration failed",
      };
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.status?.message || "Registration failed",
      };
    }
  },

  // 🔹 LOGOUT
  logout: async () => {
    try {
      await api.delete("/logout", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("token");
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
