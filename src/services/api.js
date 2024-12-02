import axios from 'axios';

export const api = axios.create({
  // baseURL: 'http://192.168.13.2:5050/api'
  baseURL: 'http://localhost:5050/api'
});

const getToken = () => {
  return localStorage.getItem('@alvo:token');
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
