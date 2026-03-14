import apiClient from './apiClient';

/**
 * Search Service: Unified discovery across the platform.
 * Mapped to api_contract_search.md
 */
export const searchService = {
    /**
     * Perform a unified search.
     */
    searchAll: async (query: string, type: string = 'all', page: number = 1) => {
        const response = await apiClient.get('/search', {
            params: { q: query, type, page }
        });
        return response.data;
    },

    /**
     * Find nearby matches/players.
     */
    findNearby: async (lat: number, lng: number, radius: number, entityType: string) => {
        const response = await apiClient.get('/search/nearby', {
            params: { lat, lng, radius, entityType }
        });
        return response.data;
    },

    /**
     * Get trending tags and search suggestions.
     */
    getSuggestions: async () => {
        const response = await apiClient.get('/search/suggestions');
        return response.data;
    }
};
