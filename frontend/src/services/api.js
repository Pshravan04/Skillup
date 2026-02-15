import axios from 'axios';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'}/api`,
});

// Add a request interceptor to include the JWT token
API.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor for global error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('NETWORK ERROR DETECTED:');
            console.error('- BaseURL:', API.defaults.baseURL);
            console.error('- Message:', error.message);
            console.error('Check if your backend is awake at:', API.defaults.baseURL.replace('/api', ''));
        }
        return Promise.reject(error);
    }
);

export default API;
