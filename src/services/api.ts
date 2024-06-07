import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
