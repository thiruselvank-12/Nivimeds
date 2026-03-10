import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserAddress {
  id: string;
  label: string; // Home, Work, Other
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
  paybackPoints: number;
  membershipTier: 'none' | 'basic' | 'plus';
  membershipExpiry?: string;
  addresses: UserAddress[];
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  addAddress: (address: UserAddress) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addPaybackPoints: (points: number) => void;
}

const DEMO_USER: User = {
  id: 'demo-001',
  name: 'Ravi Kumar',
  phone: '9876543210',
  email: 'ravi@example.com',
  paybackPoints: 320,
  membershipTier: 'plus',
  membershipExpiry: '2026-12-31',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      name: 'Ravi Kumar',
      phone: '9876543210',
      line1: '42, Anna Nagar East',
      line2: 'Near Metro Station',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600102',
      isDefault: true,
    },
  ],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user) => set({ user, isLoggedIn: true }),

      logout: () => set({ user: null, isLoggedIn: false }),

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
                addresses: state.user.addresses.filter((a) => a.id !== id),
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
                  isDefault: a.id === id,
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

// Export demo user for dev login convenience
export { DEMO_USER };
