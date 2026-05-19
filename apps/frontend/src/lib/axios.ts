import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // You can handle global errors here (e.g., unauthorized redirects, toast notifications)
    return Promise.reject(error);
  }
);
