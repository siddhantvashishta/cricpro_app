import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Base API Client configuration.
 * Replace 'BASE_URL' with your actual backend production/staging URL.
 */
const BASE_URL = 'https://api.cricpro.com/v1';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

// Request Interceptor: Attach Auth Token if available
apiClient.interceptors.request.use(
    async (config) => {
        const stateStr = await AsyncStorage.getItem('cricpro-app-storage');
        if (stateStr) {
            const state = JSON.parse(stateStr);
            const token = state.state?.user?.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle automatic logout or token refresh here
            console.warn('Session expired. Redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
