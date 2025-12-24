import axios from 'axios';

// Hardcoded for production stability
export const API_URL = "https://second-brain-2-gwgk.onrender.com/api/v1";
console.log("Current API URL:", API_URL);
// export const API_URL = "http://localhost:3000/api/v1";

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
