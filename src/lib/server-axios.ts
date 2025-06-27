import axios from 'axios';
import { auth, currentUser } from '@clerk/nextjs/server';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const serverAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
serverAxios.interceptors.request.use(
  async (config) => {
    try {
      const user = await currentUser();
      if (!user) {
        return Promise.reject(new Error('Authentication required'));
      }

      const session = await auth();
      const token = await session.getToken();
      if (!token) {
        return Promise.reject(new Error('Authentication token required'));
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      console.log('error 1: ', error);
      console.error('Auth error:', error);
      return Promise.reject(new Error('Authentication failed'));
    }
  },
  (error) => {
    console.log('error 2: ', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
serverAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('error 3: ', error.response?.data);
    return Promise.reject(error);
  }
);

export default serverAxios;
