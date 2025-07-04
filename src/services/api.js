import axios from 'axios';

const isProd = process.env.REACT_APP_PROD === 'true';
const apiUrl = isProd ? process.env.REACT_APP_API_URL : 'http://localhost:5051/api';

export const api = axios.create({ baseURL: apiUrl });

const getToken = () => localStorage.getItem('@vistoria:token');

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
