import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // ✅ مهم جدًا

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
    