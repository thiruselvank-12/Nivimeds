import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  requiresPrescription: boolean;
  brand?: string;
  unit?: string;
}

interface Coupon {
  code: string;
  discount: number; // percentage
  type: 'percent' | 'flat';
}

const VALID_COUPONS: Record<string, Coupon> = {
  'NIVI10': { code: 'NIVI10', discount: 10, type: 'percent' },
  'FIRST20': { code: 'FIRST20', discount: 20, type: 'percent' },
  'FLAT50': { code: 'FLAT50', discount: 50, type: 'flat' },
};

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  couponError: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  totalItems: () => number;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
  deliveryFee: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      couponError: '',

      addItem: (item) => set((state) => {
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { items: [...state.items, { ...item, quantity: 1 }] };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter((i) => i.id !== id) };
        }
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        };
      }),

      clearCart: () => set({ items: [], coupon: null, couponError: '' }),

      applyCoupon: (code) => {
        const c = VALID_COUPONS[code.toUpperCase()];
        if (c) {
          set({ coupon: c, couponError: '' });
        } else {
          set({ couponError: 'Invalid coupon code. Try NIVI10 or FIRST20.' });
        }
      },

      removeCoupon: () => set({ coupon: null, couponError: '' }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      discount: () => {
        const sub = get().subtotal();
        const c = get().coupon;
        if (!c) return 0;
        if (c.type === 'percent') return Math.round((sub * c.discount) / 100);
        return Math.min(c.discount, sub);
      },

      deliveryFee: () => {
        const sub = get().subtotal();
        return sub >= 499 ? 0 : 49;
      },

      total: () => {
        const sub = get().subtotal();
        const disc = get().discount();
        const delivery = get().deliveryFee();
        return sub - disc + delivery;
      },
    }),
    { name: 'nivimeds-cart' }
  )
);
