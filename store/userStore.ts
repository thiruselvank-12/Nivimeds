import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../lib/apiClient';
import { cartApi } from '../lib/apiClient';

export interface UserAddress {
  _id?: string;
  id?: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
  paybackPoints: number;
  membershipTier: 'none' | 'basic' | 'plus';
  membershipExpiry?: string;
  addresses: UserAddress[];
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addAddress: (address: UserAddress) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addPaybackPoints: (points: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,

      setUser: (user) => set({ user, isLoggedIn: true }),

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout errors, always clear local state
        }
        set({ user: null, isLoggedIn: false });
      },

      refreshUser: async () => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.me();
          if (data.user) {
            set({ user: data.user, isLoggedIn: true });
          } else {
            set({ user: null, isLoggedIn: false });
          }
        } catch {
          set({ user: null, isLoggedIn: false });
        } finally {
          set({ isLoading: false });
        }
      },

      addAddress: (address) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, addresses: [...state.user.addresses, address] }
            : null,
        })),

      removeAddress: (id) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: state.user.addresses.filter(
                  (a) => (a._id || a.id) !== id
                ),
              }
            : null,
        })),

      setDefaultAddress: (id) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: state.user.addresses.map((a) => ({
                  ...a,
                  isDefault: (a._id || a.id) === id,
                })),
              }
            : null,
        })),

      addPaybackPoints: (points) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, paybackPoints: state.user.paybackPoints + points }
            : null,
        })),
    }),
    { name: 'nivimeds-user' }
  )
);
