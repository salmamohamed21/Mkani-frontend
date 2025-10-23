import axios from "axios";

const publicAxiosInstance = axios.create({
  baseURL: "https://terrific-success-production.up.railway.app/api/",
  headers: { "Content-Type": "application/json" },
});

export default publicAxiosInstance;
