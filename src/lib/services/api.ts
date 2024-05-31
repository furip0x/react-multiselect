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
    // const lang = localStorage.getItem('lng');
    // const token = Cookies.get('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    // if (lang) {
    //   config.headers['Accept-Language'] = lang;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
