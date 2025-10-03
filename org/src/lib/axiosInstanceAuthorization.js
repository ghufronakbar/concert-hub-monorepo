import axios from 'axios';
import { baseUrlApi } from './baseUrlApi';

const axiosInstanceAuthorization = axios.create({
  baseURL: `${baseUrlApi}`
});

// Tambahkan interceptor untuk menambahkan Bearer token
axiosInstanceAuthorization.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstanceAuthorization;
