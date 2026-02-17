import axios from 'axios';

// Debug: Log the API URL being used
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Using baseURL:', import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Auth APIs
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    getProfile: () => api.get('/auth/profile'),
};

// Group APIs
export const groupAPI = {
    getAll: (params) => api.get('/groups', { params }),
    getById: (id) => api.get(`/groups/${id}`),
    create: (data) => api.post('/groups', data),
    update: (id, data) => api.put(`/groups/${id}`, data),
    delete: (id) => api.delete(`/groups/${id}`),
    getDashboardStats: () => api.get('/groups/stats/dashboard'),
};

// Teacher APIs
export const teacherAPI = {
    getAll: () => api.get('/teachers'),
    getById: (id) => api.get(`/teachers/${id}`),
};

export default api;
