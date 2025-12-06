import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: async (data) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  requestVerification: async () => {
    const response = await api.post('/request-verification');
    return response.data;
  },

  verifyOtp: async (otp) => {
    const response = await api.post('/verify-otp', { otp });
    return response.data;
  },

  checkUsername: async (username) => {
    const response = await api.post('/check-username', { username });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },
};

export default api;


