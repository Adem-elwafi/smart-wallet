import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

const getCurrentToken = () => localStorage.getItem('token');

// Intercepteur pour ajouter le token automatiquement si présent
api.interceptors.request.use((config) => {
    const requestUrl = config.url ?? '';
    const isAuthEndpoint = requestUrl.includes('/v1/auth/authenticate') || requestUrl.includes('/v1/auth/register');

    if (isAuthEndpoint) {
        return config;
    }

    const token = getCurrentToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;