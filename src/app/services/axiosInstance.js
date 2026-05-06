import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor — attach access token ────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// ─── Response interceptor — handle standard responses & 401 ──────
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response follows the new standard format
    if (response.data && response.data.statusCode !== undefined && response.data.data !== undefined) {
      if (response.data.totalRecords !== undefined) {
        // It's a paginated response. Let the components access response.data.data and response.data.totalRecords
        // We do not unwrap it so the pagination metadata remains intact.
        return response;
      } else {
        // Standard non-paginated response unwrapping
        response.data = response.data.data;
      }
    }
    return response;
  },
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
