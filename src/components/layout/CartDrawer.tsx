"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { items, removeItem, updateQuantity, isOpen, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch products when cart changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);

        const ids = items.map((item) => item.id);

        const res = await fetch("/api/products/by-ids", {
          method: "POST",
          body: JSON.stringify({ ids }),
        });

        const data = await res.json();

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch cart products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [items]);

  if (!mounted) return <>{children}</>;

  // ✅ Merge products with quantities
  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id);

      if (!product) return null; // product deleted

      return {
        ...product,
        quantity: item.quantity,
      };
    })
    .filter(Boolean);

  // ✅ Calculate total
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">

        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter">
            <ShoppingCart className="w-6 h-6 text-accent" />
            Your Cart
            {items.length > 0 && (
              <Badge className="ml-2 bg-black text-white rounded-full">
                {items.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <p className="text-muted-foreground font-medium">
                Your cart is empty.
              </p>
              <SheetClose asChild>
                <Button variant="outline">
                  Start Shopping
                </Button>
              </SheetClose>
            </div>
          ) : loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">

                  <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden border">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between py-1">

                    <div className="flex justify-between">
                      <h4 className="font-bold text-sm line-clamp-2">
                        {item.title}
                      </h4>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">

                      <div className="flex items-center border rounded-md h-8">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-2"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && !loading && (
          <SheetFooter className="p-6 border-t flex-col gap-4">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Button
              onClick={() => {
                setIsOpen(false);
                router.push("/checkout");
              }}
              className="w-full"
            >
              Checkout
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}