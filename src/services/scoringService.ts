import apiClient from './apiClient';

/**
 * Live Scoring Service: Handles ball-by-ball updates and match states.
 * Mapped to api_contract_scoring.md
 */
export const scoringService = {
    /**
     * Initialize a match for scoring.
     */
    startMatch: async (matchId: string, initData: any) => {
        const response = await apiClient.post(`/scoring/matches/${matchId}/start`, initData);
        return response.data;
    },

    /**
     * Post a ball update.
     */
    postBall: async (matchId: string, ballData: any) => {
        const response = await apiClient.post(`/scoring/matches/${matchId}/update`, ballData);
        return response.data;
    },

    /**
     * Get live scorecard.
     */
    getLiveScore: async (matchId: string) => {
        const response = await apiClient.get(`/scoring/matches/${matchId}/live`);
        return response.data;
    }
};
