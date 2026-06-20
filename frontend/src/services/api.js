import axios from 'axios';
import { triggerGlobalToast } from '../context/ToastContext';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            // Network error
            triggerGlobalToast('Network error. Please check your connection.', 'error');
        } else {
            const status = error.response.status;

            if (status === 401) {
                // Unauthorized / Token Expired
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else if (status === 403) {
                // Forbidden role access
                triggerGlobalToast('Unauthorized Access. You do not have permission for this action.', 'warning');
            } else if (status === 400 || status === 422) {
                if (error.response.data.message) triggerGlobalToast(error.response.data.message, 'warning');
            } else if (status >= 500) {
                // Server error
                triggerGlobalToast('Something went wrong on our end. Please try again later.', 'error');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
