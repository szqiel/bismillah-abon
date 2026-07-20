import { create } from 'zustand';
import { GearItem } from './data';

export interface CartItem {
  id: string; // unique id for the cart item
  gear: GearItem;
  quantity: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  days: number;
  totalPrice: number;
}

interface BookingStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
}));
