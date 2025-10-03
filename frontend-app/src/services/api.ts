import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@AisamRecrutamento:token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@AisamRecrutamento:token');
      localStorage.removeItem('@AisamRecrutamento:user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
