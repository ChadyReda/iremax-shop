"use client";

import Link from "next/link";
import { Star, Heart } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  const { items: wishlistItems, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => setMounted(true), []);

  const isWishlisted =
    mounted && wishlistItems.some((productId) => productId === product.id);

  const discountAmount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

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
    <Card className="group bg-white border border-gray-100 overflow-hidden rounded-xl hover:shadow-lg transition-all">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </Link>

          {(discountAmount > 0 || product.isNew) && (
            <div className="absolute top-2 right-2 flex gap-1">
              {discountAmount > 0 && (
                <Badge className="bg-accent text-white text-xs font-bold px-2 border-none">
                  -{discountAmount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-black text-white text-xs font-bold px-2 border-none">
                  New
                </Badge>
              )}
            </div>
          )}

          <div className="absolute top-2 left-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleWishlist}
              className={cn(
                "w-8 h-8 rounded-full bg-white/90 shadow-sm",
                isWishlisted ? "text-accent" : "text-gray-600 hover:text-accent"
              )}
            >
              <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
            </Button>
          </div>
        </div>

        <div className="p-3 space-y-2">
          <Link href={`/category/${product.category?.slug}`}>
            <span className="text-[10px] uppercase text-gray-500 font-medium">
              {product.category?.name || product.category?.slug}
            </span>
          </Link>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-sm text-foreground line-clamp-2">
              {product.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => {
                const filled = i + 1 <= product.rating;
                return (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      filled ? "fill-current" : "text-gray-300 fill-none"
                    )}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-gray-500">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">
                ${product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full h-9 bg-black text-sm font-medium rounded-lg"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}