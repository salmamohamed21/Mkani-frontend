import axios from "axios";

axios.defaults.baseURL = "https://terrific-success-production.up.railway.app/api/";
axios.defaults.withCredentials = true; // ✅ مهم جدًا

const axiosInstance = axios.create({
  baseURL: "https://terrific-success-production.up.railway.app/api/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
    