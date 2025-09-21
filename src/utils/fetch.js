import axios from 'axios';
import { getLocalStorageKey, setLocalStorageKey, clearLocalStorage } from './localStorage';
import { errorMessage } from './toast';

const API_URL = import.meta.env.VITE_API_URL;

// Create separate instances to avoid interceptor conflicts
const apiInstance = axios.create({
    baseURL: API_URL
});

const unauthorizedInstance = axios.create({
    baseURL: API_URL
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    
    failedQueue = [];
};

const refreshAccessToken = async () => {
    const refreshTokenValue = getLocalStorageKey('refresh');
    
    if (!refreshTokenValue) {
        clearLocalStorage();
        errorMessage("Your session has expired. Please log in again.");
        throw new Error("No refresh token available");
    }

    try {
        const response = await unauthorizedInstance.post('/auth/refresh/', { 
            refresh: refreshTokenValue 
        });

        if (response?.success && response?.data?.access) {
            const { access, refresh: newRefreshToken } = response.data;
            
            setLocalStorageKey('access', access);
            if (newRefreshToken) {
                setLocalStorageKey('refresh', newRefreshToken);
            }
            
            return access;
        } else {
            throw new Error("Invalid response structure from refresh endpoint");
        }
    } catch (error) {
        clearLocalStorage();
        errorMessage("Your session has expired. Please log in again.");
        throw error;
    }
};

// Request interceptor - add auth token
apiInstance.interceptors.request.use(
    (config) => {
        const accessToken = getLocalStorageKey('access');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for auth endpoints
            if (originalRequest.url?.includes('/auth/login') || 
                originalRequest.url?.includes('/auth/refresh')) {
                return handleErrorResponse(error);
            }

            if (isRefreshing) {
                // Queue request while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiInstance(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                processQueue(null, newToken);
                
                // Ensure headers object exists and set new token
                if (!originalRequest.headers) {
                    originalRequest.headers = {};
                }
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                
                return apiInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return handleErrorResponse(error);
    }
);

// Handle error responses and show user-friendly messages
const handleErrorResponse = (error) => {
    const { response } = error;

    if (response?.data?.error?.message) {
        errorMessage(response.data.error.message);
    } else if (response?.data?.detail) {
        let errorMsg = response.data.detail;
        if (Array.isArray(errorMsg) && errorMsg[0]?.msg) {
            errorMsg = errorMsg[0].msg;
        }
        errorMessage(typeof errorMsg === 'string' ? errorMsg : "An error occurred");
    } else if (!response) {
        errorMessage("Network error. Please check your connection.");
    } else {
        errorMessage("An unexpected error occurred. Please try again.");
    }

    return Promise.reject(error);
};

// Unauthorized instance response interceptor (for auth endpoints)
unauthorizedInstance.interceptors.response.use(
    (response) => response.data,
    (error) => handleErrorResponse(error)
);

// Export API methods
export const get = (url, options = {}) => apiInstance.get(url, options);
export const post = (url, data, options = {}) => apiInstance.post(url, data, options);
export const put = (url, data, options = {}) => apiInstance.put(url, data, options);
export const patch = (url, data, options = {}) => apiInstance.patch(url, data, options);
export const remove = (url, options = {}) => apiInstance.delete(url, options);

// Unauthorized methods (for auth endpoints)
export const unauthorizedGet = (url, options = {}) => unauthorizedInstance.get(url, options);
export const unauthorizedPost = (url, data, options = {}) => unauthorizedInstance.post(url, data, options);
