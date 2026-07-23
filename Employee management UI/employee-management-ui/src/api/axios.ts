import axios from "axios";

// Use HTTPS since your backend runs on https://localhost:44304
const API_BASE_URL = "https://localhost:44304/api";

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

// Response interceptor → handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or missing → redirect to login
      localStorage.removeItem("token"); // clear invalid token
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
