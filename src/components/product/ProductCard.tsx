"use client";

import Link from "next/link";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => setMounted(true), []);

  // 🔹 Derived state
  const isWishlisted =
    mounted && wishlistItems.some((productId) => productId === product.id);

  const discountAmount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const stockColor =
    product.stockStatus === "in-stock"
      ? "text-success bg-success"
      : product.stockStatus === "low-stock"
        ? "text-amber-500 bg-amber-500"
        : "text-destructive bg-destructive";

  // 🔹 Handlers
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    isWishlisted
      ? removeWishlist(product.id)
      : addWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
  };

  return (
    <Card
      className="py-0 group bg-white border border-transparent outline-none hover:border transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-black/3 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-white group-hover:bg-gray-50 transition-colors duration-500">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover object-center transition-transform duration-700",
                isHovered ? "scale-105" : "scale-100"
              )}
            />
          </Link>

          {/* Badges */}
          {(discountAmount > 0 || product.isNew) && (
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {discountAmount > 0 && (
                <Badge className="bg-accent text-white font-bold px-2 py-0.5 border-none rounded">
                  -{discountAmount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-black text-white font-bold px-2 py-0.5 border-none rounded uppercase text-[10px] tracking-widest">
                  New
                </Badge>
              )}
            </div>
          )}

          {/* Wishlist */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleWishlist}
              className={cn(
                "w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm transition-colors",
                isWishlisted ? "text-accent" : "text-black hover:text-accent"
              )}
            >
              <Heart className={cn("w-4.5 h-4.5", isWishlisted && "fill-current")} />
            </Button>
          </div>

          {/* Add to Cart */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full h-11 bg-black hover:bg-black/90 text-white rounded-lg font-bold shadow-lg shadow-black/20 gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add To Cart
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Category */}
          <Link href={`/category/${product.category?.slug}`}>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold hover:text-black transition-colors">
              {product.category?.name || product.category?.slug}
            </span>
          </Link>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-sm leading-tight text-foreground transition-colors group-hover:text-accent h-10 line-clamp-2 uppercase tracking-tight">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => {
                const filled = i + 1 <= product.rating;
                return (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      filled ? "fill-current" : "text-gray-200 fill-none"
                    )}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1 border-t border-transparent group-hover:border-border transition-colors">
            <span className="text-xl font-black text-black tracking-tighter">
              ${product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through font-medium opacity-60">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="pt-1 flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", stockColor.split(" ")[1])} />
            <span className={cn("text-[9px] uppercase font-black tracking-widest", stockColor.split(" ")[0])}>
              {product.stockStatus.replace("-", " ")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}