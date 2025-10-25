import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://terrific-success-production.up.railway.app/",
  withCredentials: true,  // critical for sending/receiving cookies
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
