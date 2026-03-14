import apiClient from './apiClient';

/**
 * Community Service: Handles social feeds, posts, and interactions.
 * Mapped to api_contract_community.md
 */
export const communityService = {
    /**
     * Fetch the social feed based on category and pagination.
     */
    getFeed: async (category?: string, page: number = 1) => {
        const response = await apiClient.get('/community/feed', {
            params: { category, page }
        });
        return response.data;
    },

    /**
     * Create a new community post.
     */
    createPost: async (content: string, image?: string, tags: string[] = []) => {
        const response = await apiClient.post('/community/posts', {
            content,
            image,
            tags
        });
        return response.data;
    },

    /**
     * Toggle like on a post.
     */
    likePost: async (postId: string) => {
        const response = await apiClient.post(`/community/posts/${postId}/like`);
        return response.data;
    },

    /**
     * Add a comment to a post.
     */
    addComment: async (postId: string, content: string) => {
        const response = await apiClient.post(`/community/posts/${postId}/comments`, {
            content
        });
        return response.data;
    }
};
