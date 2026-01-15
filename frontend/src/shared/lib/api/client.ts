import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors and unwrap data
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the data from the standard API response format
    // Backend returns: { success: true, data: {...} }
    return response.data.data ? response.data : response.data;
  },
  (error: AxiosError<{ message?: string | string[] }>) => {
    // Extract error message from response
    const rawMessage = error.response?.data?.message || 'Une erreur est survenue';
    const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
    
    return Promise.reject(new Error(message));
  }
);

export { apiClient };
