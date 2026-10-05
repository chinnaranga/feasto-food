import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '@/data/restaurants';
import { useLoyaltyStore } from './loyalty/loyaltyStore';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartAddon {
  groupId: string;
  groupName: string;
  addonId: string;
  addonName: string;
  addonPrice: number;
}

export interface CartItem {
  cartItemId: string; // unique per combination
  restaurantId: string;
  restaurantName: string;
  item: MenuItem;
  quantity: number;
  selectedAddons: CartAddon[];
  spiceLevel: string;
  specialInstructions: string;
  unitPrice: number; // item.price + addons
  totalPrice: number; // unitPrice * quantity
}

export type PaymentMethod = 'card' | 'upi' | 'wallet' | 'cod' | 'razorpay' | 'cashfree';
export type DeliverySlot = 'asap' | 'scheduled';

export interface SavedAddress {
  id: string;
  label: string;
  fullAddress: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  email: string;
  addressId: string | null;
  newAddress: Omit<SavedAddress, 'id' | 'isDefault'> | null;
  deliveryInstructions: string;
  deliverySlot: DeliverySlot;
  promoCode: string;
  paymentMethod: PaymentMethod;
}

// ─── Store ───────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  savedAddresses: SavedAddress[];
  promoCode: string;
  promoDiscount: number;
  creditApplied: number;
  checkoutForm: CheckoutForm;

  // Cart actions
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Promo & Credits
  applyPromo: (code: string) => { success: boolean; message: string };
  clearPromo: () => void;
  applyCredits: (amount: number) => void;
  clearCredits: () => void;

  // Address
  selectAddress: (id: string) => void;

  // Checkout form
  updateCheckoutForm: (partial: Partial<CheckoutForm>) => void;
  resetCheckout: () => void;

  // Computed getters
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTaxes: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const VALID_PROMOS: Record<string, number> = {
  FEASTO10: 10,
  FEASTO20: 20,
  NEWUSER: 15,
  HEALTHY5: 5,
};

const DEFAULT_CHECKOUT_FORM: CheckoutForm = {
  name: '',
  phone: '',
  email: '',
  addressId: null,
  newAddress: null,
  deliveryInstructions: '',
  deliverySlot: 'asap',
  promoCode: '',
  paymentMethod: 'razorpay',
};

const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullAddress: '14, Greenfield Apartments, Koramangala 5th Block',
    city: 'Bengaluru',
    pincode: '560034',
    landmark: 'Near Jyoti Nivas College',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    fullAddress: '91 Springboard, Indiranagar 12th Main',
    city: 'Bengaluru',
    pincode: '560038',
    isDefault: false,
  },
];

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedAddresses: MOCK_ADDRESSES,
      promoCode: '',
      promoDiscount: 0,
      creditApplied: 0,
      checkoutForm: DEFAULT_CHECKOUT_FORM,

      addItem: (cartItem) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.cartItemId === cartItem.cartItemId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItem.cartItemId
                  ? {
                      ...i,
                      quantity: i.quantity + cartItem.quantity,
                      totalPrice: (i.quantity + cartItem.quantity) * i.unitPrice,
                    }
                  : i
              ),
            };
          }
          return { items: [...state.items, cartItem] };
        }),

      removeItem: (cartItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.cartItemId !== cartItemId)
              : state.items.map((i) =>
                  i.cartItemId === cartItemId
                    ? { ...i, quantity, totalPrice: quantity * i.unitPrice }
                    : i
                ),
        })),

      clearCart: () => set({ items: [], promoCode: '', promoDiscount: 0, creditApplied: 0 }),

      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase();
        const discount = VALID_PROMOS[normalized];
        if (discount !== undefined) {
          set({ promoCode: normalized, promoDiscount: discount });
          return { success: true, message: `${discount}% discount applied!` };
        }
        return { success: false, message: 'Invalid or expired promo code.' };
      },

      clearPromo: () => set({ promoCode: '', promoDiscount: 0 }),

      applyCredits: (amount: number) => set({ creditApplied: amount }),

      clearCredits: () => set({ creditApplied: 0 }),

      selectAddress: (id) =>
        set((state) => ({
          checkoutForm: { ...state.checkoutForm, addressId: id },
        })),

      updateCheckoutForm: (partial) =>
        set((state) => ({
          checkoutForm: { ...state.checkoutForm, ...partial },
        })),

      resetCheckout: () => set({ checkoutForm: DEFAULT_CHECKOUT_FORM }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.totalPrice, 0),

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;

        try {
          const loyaltyState = useLoyaltyStore.getState();
          if (loyaltyState.membershipTier === 'elite') return 0;
          if (loyaltyState.membershipTier === 'plus' && subtotal >= 199) return 0;
        } catch (e) {
          // ignore
        }

        return subtotal >= 500 ? 0 : 49;
      },

      getTaxes: () => Math.round(get().getSubtotal() * 0.05),

      getDiscount: () => {
        const { promoDiscount } = get();
        if (promoDiscount === 0) return 0;
        return Math.round(get().getSubtotal() * (promoDiscount / 100));
      },

      getTotal: () => {
        const s = get();
        const discountAmount = s.getDiscount() + (s.creditApplied || 0);
        return Math.max(0, s.getSubtotal() + s.getDeliveryFee() + s.getTaxes() - discountAmount);
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'feasto-cart' }
  )
);
