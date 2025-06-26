import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Only try to get token if we're in a browser environment
      if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies.find((cookie) =>
          cookie.trim().startsWith('__session=')
        );
        if (sessionCookie) {
          const token = sessionCookie.split('=')[1].trim();
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (can add toast notifications here)
    return Promise.reject(error);
  }
);

export default axiosInstance;
