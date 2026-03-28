import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  items: string[]; // only store product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      // ✅ Add product by ID
      addItem: (productId) => {
        const currentItems = get().items;
        if (!currentItems.includes(productId)) {
          set({ items: [productId, ...currentItems] });
        }
      },

      // ✅ Remove product by ID
      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      // ✅ Check if product is in wishlist
      isInWishlist: (productId) => {
        return get().items.includes(productId);
      },

      // ✅ Clear wishlist
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);