import apiClient from './apiClient';

/**
 * Chat & Messaging Service: Handles conversations and real-time requests.
 * Mapped to api_contract_chat.md
 */
export const chatService = {
    /**
     * Get list of active conversations.
     */
    getConversations: async () => {
        const response = await apiClient.get('/chat/conversations');
        return response.data;
    },

    /**
     * Get message history for a conversation.
     */
    getMessageHistory: async (conversationId: string, params?: { limit?: number; before?: string }) => {
        const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`, { params });
        return response.data;
    },

    /**
     * Send a connection request (Hire/Challenge).
     */
    sendRequest: async (requestData: { targetId: string; targetType: string; initialMessage: string }) => {
        const response = await apiClient.post('/chat/requests', requestData);
        return response.data;
    }
};
