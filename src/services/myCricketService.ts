import apiClient from './apiClient';

/**
 * My Cricket Service: Handles matches, teams, and personal stats.
 * Mapped to api_contract_my_cricket.md
 */
export const myCricketService = {
    /**
     * Get user's matches (Upcoming/Finished).
     */
    getMyMatches: async () => {
        const response = await apiClient.get('/my-cricket/matches');
        return response.data;
    },

    /**
     * Create a new team.
     */
    createTeam: async (teamData: any) => {
        const response = await apiClient.post('/my-cricket/teams', teamData);
        return response.data;
    },

    /**
     * Schedule a new match.
     */
    scheduleMatch: async (matchData: any) => {
        const response = await apiClient.post('/my-cricket/matches', matchData);
        return response.data;
    },

    /**
     * Fetch player stats.
     */
    getPlayerStats: async (playerId: string) => {
        const response = await apiClient.get(`/my-cricket/stats/${playerId}`);
        return response.data;
    }
};
