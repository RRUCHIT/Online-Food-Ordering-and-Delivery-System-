import axios from "axios";

const API = axios.create({
  // Use relative path for monolith; in production, this correctly points to the same domain.
  baseURL: import.meta.env.VITE_API_URL || "",
});

// Add a request interceptor to include the auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // If your backend expects 'Bearer <token>', uncomment below:
      // config.headers.Authorization = `Bearer ${token}`;
      // Current backend seems to expect just the token string:
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
