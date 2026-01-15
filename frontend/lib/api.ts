import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
});

// Response interceptor to extract data
api.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);
