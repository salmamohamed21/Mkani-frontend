import axios from "axios";

axios.defaults.baseURL = "https://terrific-success-production.up.railway.app/";
axios.defaults.withCredentials = true; // ✅ مهم جدًا

const axiosInstance = axios.create({
  baseURL: "https://terrific-success-production.up.railway.app/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
    