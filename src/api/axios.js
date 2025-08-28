import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api/v1", // your Rails API base URL
  withCredentials: true,
});

// Add JWT token automatically if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
