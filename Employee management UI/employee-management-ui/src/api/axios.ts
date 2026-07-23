import axios from "axios";
import { toast } from "react-hot-toast";

// In development, Vite proxies /api to the backend server.
// This avoids browser CORS preflight issues on localhost.
const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please sign in again.");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status === 404) {
      toast("No records found.", {
        icon: "ℹ️",
      });
    }

    if (status && status >= 500) {
      toast.error("A server error occurred. Please try again later.");
    }

    if (error.message === "Network Error") {
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
