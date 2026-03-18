import { create } from 'zustand';

interface UserProfile {
  fullName: string;
  username: string;
  dob: string;
  city: string;
  avatar?: string;
  playingRole?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  experienceLevel?: string;
  setupComplete: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  finishSetup: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Default to authenticated for development speed-up
  isAuthenticated: true,
  userProfile: {
    fullName: 'Dev User',
    username: 'dev.user',
    dob: '1990-01-01',
    city: 'Mumbai',
    setupComplete: true,
  },

  login: async (phoneNumber: string) => {
    console.log('Sending OTP to', phoneNumber);
  },

  verifyOtp: async (otp: string) => {
    if (otp.length === 6) {
      set({
        isAuthenticated: true,
        userProfile: {
          fullName: '',
          username: '',
          dob: '',
          city: '',
          setupComplete: false,
        },
      });
    } else {
      throw new Error('Invalid OTP');
    }
  },

  updateProfile: (profile) =>
    set((state) => ({
      userProfile: state.userProfile ? { ...state.userProfile, ...profile } : null,
    })),

  finishSetup: () =>
    set((state) => ({
      userProfile: state.userProfile ? { ...state.userProfile, setupComplete: true } : null,
    })),

  logout: () => set({ isAuthenticated: false, userProfile: null }),
}));
