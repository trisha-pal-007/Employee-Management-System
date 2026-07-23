import axios from "axios";

// Base URL of your ASP.NET backend
const API_BASE_URL = "http://localhost:44304/api"; // adjust if different

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or use cookies/context
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
      // Token expired or invalid → redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
