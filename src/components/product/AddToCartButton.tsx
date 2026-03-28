"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isWishlisted = mounted && wishlistItems.some((item) => item === product.id);

  const handleAddToCart = () => {
    addItem(product.id);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        size="lg"
        onClick={handleAddToCart}
        className="h-16 flex-grow bg-black hover:bg-black/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-transform active:scale-95 shadow-2xl shadow-black/10 flex items-center gap-3"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Studio Cart
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => {
          if (isWishlisted) {
            removeWishlist(product.id);
          } else {
            addWishlist(product);
          }
        }}
        className={cn(
          "h-16 w-16 rounded-2xl border-2 transition-all group",
          isWishlisted ? "border-accent text-accent" : "border-border/40 hover:border-accent hover:text-accent"
        )}
      >
        <Heart className={cn("w-6 h-6 transition-colors", isWishlisted && "fill-accent")} />
      </Button>
    </div>
  );
}
