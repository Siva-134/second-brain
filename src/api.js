import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || "https://second-brain-2-gwgk.onrender.com/api/v1";

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
