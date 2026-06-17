import { create } from 'zustand';
import { ProductType } from '../types/components';

export interface CartItem {
  product: ProductType;
  quantity: number;
}

export interface CartState {
  items: Record<string, CartItem>;
  addToCart: (product: ProductType) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

// Senior Design Decision: 
// Utilizing a flat lookup Record<string, CartItem> to enable O(1) reads/writes.
// By isolating states, we can create precise selectors (e.g. state => state.items[id]?.quantity)
// so that a single product's quantity change only triggers a re-render of its own card and the total counter,
// leaving the rest of the list unaffected.
export const useCartStore = create<CartState>((set) => ({
  items: {},
  addToCart: (product) =>
    set((state) => {
      const existing = state.items[product.id];
      const updatedItems = { ...state.items };
      if (existing) {
        updatedItems[product.id] = {
          ...existing,
          quantity: existing.quantity + 1,
        };
      } else {
        updatedItems[product.id] = { product, quantity: 1 };
      }
      return { items: updatedItems };
    }),
  removeFromCart: (productId) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) return state;

      const updatedItems = { ...state.items };
      if (existing.quantity > 1) {
        updatedItems[productId] = {
          ...existing,
          quantity: existing.quantity - 1,
        };
      } else {
        delete updatedItems[productId];
      }
      return { items: updatedItems };
    }),
  clearCart: () => set({ items: {} }),
}));

// Selectors for fine-grained re-render control
export const selectCartCount = (state: CartState) => 
  Object.values(state.items).reduce((acc, item) => acc + item.quantity, 0);

export const selectProductQuantity = (productId: string) => (state: CartState) => 
  state.items[productId]?.quantity ?? 0;
