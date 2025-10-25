import axios from "axios";

const publicAxiosInstance = axios.create({
  baseURL: "https://terrific-success-production.up.railway.app/",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default publicAxiosInstance;
