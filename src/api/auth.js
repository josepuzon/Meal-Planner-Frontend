import api from "./axios";

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", {
      user: { email, password },
    });

    if (response.data?.status?.token) {
      // Save token to localStorage for persistence
      localStorage.setItem("token", response.data.status.token);

      return response.data.status;
    }
    return null;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};
