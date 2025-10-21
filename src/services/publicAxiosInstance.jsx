import axios from "axios";

const publicAxiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  headers: { "Content-Type": "application/json" },
});

export default publicAxiosInstance;
