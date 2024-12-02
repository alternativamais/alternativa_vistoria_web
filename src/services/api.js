import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://vistoria.alternativamais.com.br/api'
  // baseURL: 'http://localhost:5051/api'
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
