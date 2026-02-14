import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet AND it wasn't the refresh endpoint itself
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token using the HttpOnly cookie
                const response = await api.post('/auth/refresh', {}, { withCredentials: true });

                const { access_token } = response.data;

                // Update local storage and header
                localStorage.setItem('access_token', access_token);
                api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (token expired or invalid)
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Enable credentials for all requests (scans, experts etc might need cookies if we used them, but refresh needs it)
// Ideally we only need it for specific endpoints, but setting it generally is safer for future if we rely on cookies more.
// Alternatively, we set it specifically in the refresh call above.
// But we should ensure the original request also carries cookies if needed? 
// For now, only refresh needs the cookie. Access token is in header.
// So no global withCredentials needed unless we want it.


// User API
export const updateUser = async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
};

export default api;
