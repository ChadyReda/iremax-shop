"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { } from "@/lib/actions/product";

export default function WishlistPage() {
  const { items, clearWishlist, removeItem } = useWishlistStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // ✅ Fetch products via API when wishlist changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/products/by-ids", {
          method: "POST",
          body: JSON.stringify({ ids: items }),
        });
        const data = await res.json();
        setProducts(data || []);
        console.log(products)
      } catch (err) {
        console.error("Failed to fetch wishlist products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [items]);

  if (!mounted) return null;

  return (
    <Container className="py-12 lg:py-20 min-h-[70vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <Heart className="w-8 h-8 text-accent fill-accent" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter italic">Wishlist</h1>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">
            Your curated collection of premium gear ({items.length} items)
          </p>
        </div>

        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="h-12 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-destructive hover:text-white hover:border-destructive transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Saved
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-secondary/20 rounded-3xl border-2 border-dashed border-border/50 animate-in fade-in zoom-in duration-500">
          <div className="p-6 bg-white rounded-full shadow-xl">
            <Heart className="w-12 h-12 text-muted-foreground/30" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tight">Your Wishlist is Empty</h3>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Save items you love and they will appear here</p>
          </div>
          <Link href="/category/all">
            <Button className="h-14 bg-black hover:bg-black/90 text-white rounded-xl font-black uppercase tracking-widest text-xs px-10 shadow-2xl shadow-black/20 gap-2">
              <ShoppingBag className="w-4 h-4" />
              Start Exploring
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 animate-in slide-in-from-bottom-5 duration-700">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <Button
                size="icon"
                variant="destructive"
                onClick={() => removeItem(product.id)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-20 pt-10 border-t flex justify-center">
          <Link href="/category/all">
            <Button variant="ghost" className="font-black uppercase tracking-widest text-xs gap-3 hover:text-accent group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
              Continue To Shop Premium
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
}
