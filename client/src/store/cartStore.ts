import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
}

interface CartState {
  items: CartLine[];
  addItem: (item: CartLine) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQty: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, qty: i.qty + item.qty } : i
              )
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.size === size && i.color === color))
        })),
      updateQty: (productId, size, color, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color ? { ...i, qty } : i
          )
        })),
      clear: () => set({ items: [] })
    }),
    { name: "boutique-cart" }
  )
);
