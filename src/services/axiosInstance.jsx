import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true; // ✅ مهم جدًا

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
    