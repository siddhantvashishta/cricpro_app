import { create } from 'zustand';

export interface SocialPost {
  id: string;
  type: 'social' | 'match_result' | 'achievement';
  user: string;
  handle: string;
  time: string;
  content?: string;
  image?: any;
  likes: number;
  comments: number;
  liked: boolean;
  bookmarked: boolean;
  // Match specific
  team1?: { name: string; score: string; flag: string };
  team2?: { name: string; score: string; flag: string };
  result?: string;
  mom?: string;
  // Achievement specific
  player?: string;
  achievement?: string;
  detail?: string;
}

export interface SocialNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'like' | 'comment' | 'mention' | 'system';
  isRead: boolean;
}

interface SocialState {
  posts: SocialPost[];
  notifications: SocialNotification[];
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  markNotificationRead: (notifId: string) => void;
  addPost: (post: SocialPost) => void;
}

export const useSocialStore = create<SocialState>((set) => ({
  posts: [
    {
      id: 'p1',
      type: 'match_result',
      user: 'Official',
      handle: '@cricpro',
      time: '2h ago',
      team1: { name: 'Mumbai XI', score: '184/4', flag: '🏏' },
      team2: { name: 'Delhi CC', score: '172/9', flag: '🏏' },
      result: 'Mumbai XI defeated Delhi CC by 12 runs',
      mom: 'Ishan Kishan',
      likes: 45,
      comments: 5,
      liked: false,
      bookmarked: false,
    },
    {
      id: 'p2',
      type: 'achievement',
      user: 'Official',
      handle: '@cricpro',
      time: '5h ago',
      player: 'Arjun Sharma',
      achievement: 'scored his first century! 💯',
      detail: 'A magnificent 100 off 52 balls against Punjab Warriors.',
      likes: 210,
      comments: 15,
      liked: false,
      bookmarked: false,
    },
    {
      id: 'p3',
      type: 'social',
      user: 'Virat K.',
      handle: '@v_king',
      time: '15 mins ago',
      content: 'The atmosphere at the stadium today was electric! Nothing beats the feeling of a last-over finish 🔥🔥',
      image: require('../assets/stadium_night.png'),
      likes: 1200,
      comments: 48,
      liked: false,
      bookmarked: false,
    },
    {
      id: 'p4',
      type: 'social',
      user: 'Anjali Rai',
      handle: '@anjali_cricket',
      time: '1h ago',
      content: 'Just got my hands on the new Mumbai XI jersey! The quality is amazing. Ready for the next match! #MumbaiXI #CricPro',
      image: require('../assets/cricket_jersey.png'),
      likes: 245,
      comments: 12,
      liked: false,
      bookmarked: false,
    },
  ],
  notifications: [
    { id: 'n1', title: 'New Like', message: 'Virat K. liked your post', time: '2m ago', type: 'like', isRead: false },
    { id: 'n2', title: 'New Comment', message: 'Anjali replied: "Great catch!"', time: '1h ago', type: 'comment', isRead: false },
  ],
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ),
  })),
  toggleBookmark: (postId) => set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
    ),
  })),
  markNotificationRead: (notifId) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === notifId ? { ...n, isRead: true } : n
    ),
  })),
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts],
  })),
}));
