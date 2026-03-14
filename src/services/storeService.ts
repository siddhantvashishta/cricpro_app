import apiClient from './apiClient';

/**
 * Store Service: Handles catalog, cart persistence, and orders.
 * Mapped to api_contract_store.md
 */
export const storeService = {
    /**
     * Get all product categories.
     */
    getCategories: async () => {
        const response = await apiClient.get('/store/categories');
        return response.data;
    },

    /**
     * Get products with optional filters.
     */
    getProducts: async (params?: { category?: string; search?: string; trending?: boolean }) => {
        const response = await apiClient.get('/store/products', { params });
        return response.data;
    },

    /**
     * Get single product details.
     */
    getProductDetails: async (productId: string) => {
        const response = await apiClient.get(`/store/products/${productId}`);
        return response.data;
    },

    /**
     * Place a new order.
     */
    placeOrder: async (orderData: any) => {
        const response = await apiClient.post('/store/orders', orderData);
        return response.data;
    },

    /**
     * Update shipping address.
     */
    updateAddress: async (addressData: any) => {
        const response = await apiClient.post('/store/addresses', addressData);
        return response.data;
    }
};
