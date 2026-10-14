import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api-client';

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface Business {
  id: string;
  name: string;
  industry: string;
  onboardingComplete: boolean;
  role: string;
  currency?: string;
}

interface AuthState {
  user: User | null;
  businesses: Business[];
  activeBusiness: Business | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setBusinesses: (businesses: Business[]) => void;
  setActiveBusiness: (business: Business) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      businesses: [],
      activeBusiness: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setBusinesses: (businesses) => {
        set({ businesses });
        // Auto-select first business if none selected
        if (!get().activeBusiness && businesses.length > 0) {
          set({ activeBusiness: businesses[0] });
        }
      },

      setActiveBusiness: (business) => set({ activeBusiness: business }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          const { user, accessToken } = data.data;

          localStorage.setItem('accessToken', accessToken);
          set({ user, isAuthenticated: true });

          // Fetch user with businesses
          await get().fetchUser();
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          const { user, accessToken } = data.data;

          localStorage.setItem('accessToken', accessToken);
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Ignore errors
        }
        localStorage.removeItem('accessToken');
        set({
          user: null,
          businesses: [],
          activeBusiness: null,
          isAuthenticated: false,
        });
      },

      fetchUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          const user = data.data;
          const businesses = user.memberships?.map((m: any) => ({
            ...m.business,
            role: m.role,
          })) || [];

          set({
            user: {
              id: user.id,
              email: user.email,
              phone: user.phone,
              name: user.name,
              avatar: user.avatar,
              emailVerified: user.emailVerified,
              phoneVerified: user.phoneVerified,
            },
            businesses,
            isAuthenticated: true,
          });

          if (!get().activeBusiness && businesses.length > 0) {
            set({ activeBusiness: businesses[0] });
          }
        } catch {
          set({ isAuthenticated: false, user: null });
        }
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({
          user: null,
          businesses: [],
          activeBusiness: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'businesspulse-auth',
      partialize: (state) => ({
        user: state.user,
        activeBusiness: state.activeBusiness,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
