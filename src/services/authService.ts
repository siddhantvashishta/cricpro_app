import apiClient from './apiClient';

/**
 * Authentication Service: Handles user session and identity.
 * Mapped to api_contract_auth.md
 */
export const authService = {
    /**
     * Login with email and password.
     */
    login: async (credentials: any) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register a new user account.
     */
    register: async (userData: any) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Logout and invalidate session.
     */
    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },

    /**
     * Reset password via email.
     */
    forgotPassword: async (email: string) => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    }
};
