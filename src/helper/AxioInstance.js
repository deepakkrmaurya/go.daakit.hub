import axios from "axios";
import { storage } from "./Storage";
// const baseURL =  "http://127.0.0.1:5000/api"
const axiosInstance = axios.create({
  baseURL: "https://go-admin.daakit.com/api",
  // baseURL: baseURL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = storage.getString("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      storage.clearAll();

      // navigate login
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;