import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,  // critical for sending/receiving cookies
  headers: { "Content-Type": "application/json" },
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.code === "token_not_valid"
    ) {
      // Token is expired or invalid, redirect to login
      // We use window.location to force a hard refresh and clear all state
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session_expired=true';
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
