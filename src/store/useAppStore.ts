import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LookingFilterTab } from '../components/LookingFilterTabs';
import { MOCK_MATCHES, MatchDetails } from '../data/mockMatches';
import { MOCK_LOOKING_POSTS, LookingPost } from '../data/mockLooking';
import { MOCK_MY_CRICKET_MATCHES, MOCK_MY_CRICKET_TOURNAMENTS, MOCK_MY_CRICKET_TEAMS, MOCK_MY_CRICKET_STATS, MOCK_MY_CRICKET_HIGHLIGHTS, MyCricketMatch } from '../data/mockMyCricket';
import { MOCK_COMMUNITY_POSTS, CommunityPost } from '../data/mockCommunityPosts';
import { MOCK_PRODUCTS, STORE_CATEGORIES, Product } from '../data/mockStoreData';

interface AppState {
    // UI State - Home
    activeHomeTab: string;
    setActiveHomeTab: (tab: string) => void;

    // Header State
    headerConfig: {
        title?: string;
        rightIcons?: any[];
        showBack?: boolean;
    };
    setHeaderConfig: (config: Partial<AppState['headerConfig']>) => void;

    // UI State - Looking (Recruitment)
    activeLookingTab: LookingFilterTab;
    setActiveLookingTab: (tab: LookingFilterTab) => void;

    // Navigation State
    activeTab: string;
    setActiveTab: (tab: string) => void;

    // Search State
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // User State (Mock)
    isAuthenticated: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        coins: number;
        avatar?: string;
    } | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;

    // Polls
    pollVotes: Record<string, string>;
    setPollVote: (pollId: string, optionId: string) => void;

    // Recruitment (Looking)
    myPosts: any[];
    addPost: (post: any) => void;
    deletePost: (postId: string) => void;

    // Community
    communityPosts: any[];
    likedCommunityPosts: Record<string, boolean>; // Map of postId -> boolean
    communityPostComments: Record<string, any[]>; // Map of postId -> comments[]
    addCommunityPost: (post: any) => void;
    deleteCommunityPost: (postId: string) => void;
    fetchCommunityPosts: (category?: string) => Promise<void>;
    toggleCommunityPostLike: (postId: string) => void;
    addCommunityComment: (postId: string, comment: any) => void;

    // Chat (Mock)
    conversations: any[];
    joinedTeams: any[];
    chatRequests: any[];
    // Chat Actions
    acceptRequest: (id: string) => void;
    declineRequest: (id: string) => void;

    // Store State
    cart: any[];
    wishlist: Record<string, boolean>;
    orders: any[]; // Array of Order objects
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    toggleFavorite: (product: any) => void; // Used for UI consistency in some components
    updateCartQuantity: (productId: string, quantity: number) => void;
    toggleWishlist: (productId: string) => void;
    clearCart: () => void;
    addOrder: (order: any) => void;

    // Professional Bookings
    activeBookings: Record<string, boolean>; // map of professionalId/groundId -> boolean
    addBooking: (id: string) => void;
    deductCoins: (amount: number) => boolean;
    updateUserProfile: (updates: Partial<NonNullable<AppState['user']>>) => void;

    // Match Management
    matches: MatchDetails[];
    addMatch: (match: MatchDetails) => void;
    updateMatch: (matchId: string, updates: Partial<MatchDetails>) => void;

    // Looking (Recruitment)
    lookingPosts: LookingPost[];
    addLookingPost: (post: LookingPost) => void;
    deleteLookingPost: (postId: string) => void;

    // My Cricket
    myMatches: MyCricketMatch[];
    myTournaments: any[];
    myTeams: any[];
    myStats: any[];
    myHighlights: any[];

    // Store (Products)
    products: Product[];
    categories: any[];

    // App State
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;

    // NEW: Theme Mode
    themeMode: 'light' | 'dark';
    toggleThemeMode: () => void;

    // Shipping Address
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        phone: string;
    } | null;
    updateShippingAddress: (address: AppState['shippingAddress']) => void;

    // Premium Subscription
    isProMember: boolean;
    toggleProMembership: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // UI State - Home
            activeHomeTab: 'For you',
            setActiveHomeTab: (tab) => set({ activeHomeTab: tab }),

            headerConfig: {},
            setHeaderConfig: (config) => set((state) => ({
                headerConfig: { ...state.headerConfig, ...config }
            })),

            activeLookingTab: 'Opponent',
            setActiveLookingTab: (tab) => set({ activeLookingTab: tab }),

            activeTab: 'home',
            setActiveTab: (tab) => set({ activeTab: tab }),

            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),

            isAuthenticated: false,
            user: null,

            login: async (email, password) => {
                // Mock login logic
                if (email && password) {
                    set({
                        isAuthenticated: true,
                        user: {
                            id: 'u1',
                            name: 'Siddhant V.',
                            email: email,
                            role: 'Pro Captain',
                            coins: 1250,
                        }
                    });
                    return true;
                }
                return false;
            },

            register: async (userData) => {
                // Mock register logic
                set({
                    isAuthenticated: true,
                    user: {
                        id: 'u' + Math.random().toString(36).substr(2, 9),
                        name: userData.name || 'New Player',
                        email: userData.email,
                        role: 'Rookie',
                        coins: 500,
                    }
                });
                return true;
            },

            logout: () => {
                set({ isAuthenticated: false, user: null });
            },

            pollVotes: {},
            setPollVote: (pollId, optionId) =>
                set((state) => ({
                    pollVotes: { ...state.pollVotes, [pollId]: optionId }
                })),

            myPosts: [],
            addPost: (post) => set((state) => ({ myPosts: [post, ...state.myPosts] })),
            deletePost: (id) => set((state) => ({
                myPosts: state.myPosts.filter(p => p.id !== id)
            })),

            likedCommunityPosts: {},
            communityPostComments: {},
            addCommunityPost: (post) => set((state) => ({ communityPosts: [post, ...state.communityPosts] })),
            deleteCommunityPost: (id) => set((state) => ({
                communityPosts: state.communityPosts.filter(p => p.id !== id)
            })),
            fetchCommunityPosts: async (category) => {
                set({ isLoading: true });
                try {
                    // For now, this is a placeholder for the real API call
                    // When backend is ready: const data = await communityService.getFeed(category);
                    // For demo, we just simulate a delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // set({ communityPosts: data });
                } catch (error) {
                    console.error('Failed to fetch community posts:', error);
                } finally {
                    set({ isLoading: false });
                }
            },
            toggleCommunityPostLike: (postId) => set((state) => {
                const isLiked = !!state.likedCommunityPosts[postId];
                return {
                    likedCommunityPosts: {
                        ...state.likedCommunityPosts,
                        [postId]: !isLiked
                    }
                };
            }),
            addCommunityComment: (postId, comment) => set((state) => ({
                communityPostComments: {
                    ...state.communityPostComments,
                    [postId]: [comment, ...(state.communityPostComments[postId] || [])]
                }
            })),

            conversations: [
                { id: '1', name: "Darshan's team", lastMsg: 'Interested in the match?', time: '2m ago', unread: true },
                { id: '2', name: 'Roman Saini', lastMsg: 'I can join as a bowler.', time: '1h ago', unread: false },
            ],

            joinedTeams: [
                { id: 't1', name: 'HSR Gladiators', lastMsg: 'Practice session tomorrow at 7 AM.', time: '5m ago', unread: true, avatar: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=100' },
                { id: 't2', name: 'Mighty Meteors', lastMsg: 'Who is bringing the new ball?', time: '2h ago', unread: false, avatar: 'https://images.unsplash.com/photo-1540747913346-19e3adca174f?q=80&w=100' },
            ],

            chatRequests: [
                { id: 'req1', sender: 'Siddharth M.', message: 'Wants to join HSR Gladiators', time: '10m ago', type: 'team' },
                { id: 'req2', sender: 'Karan B.', message: 'Sent you a message request', time: '1h ago', type: 'individual' },
            ],

            acceptRequest: (id: string) => {
                set((state) => ({
                    chatRequests: (state.chatRequests || []).filter(r => r.id !== id)
                }));
            },
            declineRequest: (id: string) => {
                set((state) => ({
                    chatRequests: (state.chatRequests || []).filter(r => r.id !== id)
                }));
            },

            // Store Implementation
            cart: [],
            wishlist: {},
            orders: [],
            addToCart: (product) => set((state) => {
                const existing = state.cart.find(item => item.id === product.id);
                if (existing) {
                    return {
                        cart: state.cart.map(item =>
                            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                        )
                    };
                }
                return { cart: [...state.cart, { ...product, quantity: 1 }] };
            }),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => item.id !== productId)
            })),
            toggleFavorite: (product) => {
                // Feature placeholder
            },
            updateCartQuantity: (productId, quantity) => set((state) => ({
                cart: state.cart.map(item =>
                    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                )
            })),
            toggleWishlist: (productId) => set((state) => {
                const exists = !!state.wishlist[productId];
                return {
                    wishlist: { ...state.wishlist, [productId]: !exists }
                };
            }),
            clearCart: () => set({ cart: [] }),
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

            // Booking Implementation
            activeBookings: {},
            addBooking: (id) => set((state) => ({
                activeBookings: { ...state.activeBookings, [id]: true }
            })),
            deductCoins: (amount) => {
                let success = false;
                set((state) => {
                    if (state.user && state.user.coins >= amount) {
                        success = true;
                        return {
                            user: {
                                ...state.user,
                                coins: state.user.coins - amount
                            }
                        };
                    }
                    return state;
                });
                return success;
            },
            updateUserProfile: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),

            // Match Management Implementation
            matches: MOCK_MATCHES,
            addMatch: (match) => set((state) => ({ matches: [match, ...state.matches] })),
            updateMatch: (matchId, updates) => set((state) => ({
                matches: state.matches.map(m => m.id === matchId ? { ...m, ...updates } : m)
            })),
            // Looking
            lookingPosts: MOCK_LOOKING_POSTS,
            addLookingPost: (post) => set((state) => ({ lookingPosts: [post, ...state.lookingPosts] })),
            deleteLookingPost: (id) => set((state) => ({ lookingPosts: state.lookingPosts.filter(p => p.id !== id) })),

            // My Cricket
            myMatches: MOCK_MY_CRICKET_MATCHES,
            myTournaments: MOCK_MY_CRICKET_TOURNAMENTS,
            myTeams: MOCK_MY_CRICKET_TEAMS,
            myStats: MOCK_MY_CRICKET_STATS,
            myHighlights: MOCK_MY_CRICKET_HIGHLIGHTS,

            // Community (Refining existing)
            communityPosts: MOCK_COMMUNITY_POSTS,

            // Store (Refining existing)
            products: MOCK_PRODUCTS,
            categories: STORE_CATEGORIES,

            // App State
            isLoading: false,
            setIsLoading: (loading) => set({ isLoading: loading }),

            // NEW: Theme Mode
            themeMode: 'light',
            toggleThemeMode: () => set((state) => ({
                themeMode: state.themeMode === 'light' ? 'dark' : 'light'
            })),

            // Shipping Address Initial State
            shippingAddress: {
                name: 'Siddhant Vashishta',
                street: '123 Cricket Lane, Sport City',
                city: 'Bangalore',
                state: 'Karnataka',
                zip: '560001',
                phone: '+91 98765 43210'
            },
            updateShippingAddress: (address) => set({ shippingAddress: address }),

            // Premium Subscription
            isProMember: false,
            toggleProMembership: () => set((state) => ({
                isProMember: !state.isProMember
            })),
        }),
        {
            name: 'cricpro-app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
