import apiClient from './apiClient';

/**
 * Notification Service: Handles push tokens and alert feeds.
 * Mapped to api_contract_notifications.md
 */
export const notificationService = {
    /**
     * Get notification feed.
     */
    getNotifications: async () => {
        const response = await apiClient.get('/notifications');
        return response.data;
    },

    /**
     * Mark notifications as read.
     */
    markAsRead: async (notificationIds: string[] = []) => {
        const response = await apiClient.post('/notifications/read', { notificationIds });
        return response.data;
    },

    /**
     * Register device for push notifications.
     */
    registerPushToken: async (token: string, platform: string, deviceId: string) => {
        const response = await apiClient.post('/notifications/tokens', { token, platform, deviceId });
        return response.data;
    },

    /**
     * Get/Update notification preferences.
     */
    getSettings: async () => {
        const response = await apiClient.get('/notifications/settings');
        return response.data;
    },

    updateSettings: async (settings: any) => {
        const response = await apiClient.patch('/notifications/settings', settings);
        return response.data;
    }
};
