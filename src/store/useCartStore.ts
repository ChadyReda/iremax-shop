import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "@/types/product";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (isOpen) => set({ isOpen }),

      addItem: (productId: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === productId
        );

        if (existingItem) {
          set({
            isOpen: true,
            items: currentItems.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            isOpen: true,
            items: [...currentItems, { id: productId, quantity: 1 }],
          });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter(
            (item) => item.id !== productId
          ),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) return;

        set({
          items: get().items.map((item) =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity,
          0
        );
      },
    }),
    {
      name: "saymon-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);