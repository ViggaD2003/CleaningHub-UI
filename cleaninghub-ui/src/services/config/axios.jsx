import axios from "axios";

// Set the base URL for your API
axios.defaults.baseURL = "http://localhost:8081/api";

// Create an axios instance with custom headers
const axiosClient = axios.create({
  baseURL: axios.defaults.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add token to headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle token refresh and other errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosClient.post("/v1/auth/refresh", {}, { withCredentials: true });
        if (response.status === 200) {
          const newToken = response.data.token;
          localStorage.setItem("token", newToken);
          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (err) {
        // Handle token refresh failure (e.g., redirect to login)
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
