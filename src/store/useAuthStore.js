import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
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

      const res = await api.post("/login", payload);

      const { status } = res.data;

      if (status?.code === 200) {
        set({ user: status.data.user, token: status.token });
        localStorage.setItem("token", status.token);
        localStorage.setItem("user", JSON.stringify(status.data.user));
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
        set({ user: status.data.user, token: status.token });
        localStorage.setItem("token", status.token);
        localStorage.setItem("user", JSON.stringify(status.data.user));
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
      localStorage.removeItem("user");
      set({ user: null, token: null });
    }
  },

  // 🔹 FETCH PROFILE
  fetchProfile: async () => {
    try {
      const userId = get().user?.id;
      if (!userId) throw new Error("No user ID found in store");

      const res = await api.get(`/users/${get().user.id}/user_profile`, {
        headers: { Authorization: `Bearer ${get().token}` },
      });

      set({ user: { ...get().user, ...res.data } });
    } catch (err) {
      console.error("Fetch profile failed:", err.response?.data || err.message);
    }
  },

  // 🔹 UPDATE PROFILE
  updateProfile: async (profileData) => {
    try {
      const userId = get().user?.id;
      if (!userId) throw new Error("No user ID found in store");

      const res = await api.put(
        `/users/${get().user.id}/user_profile`,
        { user: profileData },
        {
          headers: { Authorization: `Bearer ${get().token}` },
        }
      );

      set({ user: { ...get().user, ...res.data } });

      localStorage.setItem(
        "user",
        JSON.stringify({ ...get().user, ...res.data })
      );

      return { success: true };
    } catch (err) {
      console.error(
        "Update profile failed:",
        err.response?.data || err.message
      );
      return {
        success: false,
        error: err.response?.data?.errors || "Update failed",
      };
    }
  },
}));

export default useAuthStore;
