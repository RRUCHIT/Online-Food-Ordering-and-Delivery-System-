import axios from "axios";

const API = axios.create({
  // Use relative path for monolith; in production, this correctly points to the same domain.
  baseURL: import.meta.env.VITE_API_URL || "",
});

export default API;
