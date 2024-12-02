import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://vistoria.alternativamais.com.br/api'
  // baseURL: 'http://localhost:5051/api'
});

const getToken = async () => {
  return await localStorage.getItem('@alvo:token');
};

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
