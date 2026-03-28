"use client";

import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { createOrder } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, ChevronLeft, CreditCard, Truck, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function CheckoutPage() {
   const { items, clearCart } = useCartStore();
   const { data: session } = useSession();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [products, setProducts] = useState<any[]>([]);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   // ✅ Fetch products
   useEffect(() => {
      const fetchProducts = async () => {
         if (items.length === 0) {
            setProducts([]);
            return;
         }

         const ids = items.map((item) => item.id);

         const res = await fetch("/api/products/by-ids", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
         });

         const data = await res.json();
         setProducts(data);
      };

      fetchProducts();
   }, [items]);

   if (!mounted) return null;

   // ✅ Merge
   const cartItems = items
      .map((item) => {
         const product = products.find((p) => p.id === item.id);
         if (!product) return null;

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

   if (items.length === 0) {
      return (
         <Container className="py-32 flex flex-col items-center justify-center space-y-6">
            <ShoppingBag className="w-20 h-20 text-muted-foreground/20" />
            <p className="text-xl font-black uppercase tracking-widest italic opacity-40">Your set is empty</p>
            <Link href="/"><Button className="bg-black text-white font-black px-10">Return to Depot</Button></Link>
         </Container>
      );
   }

   const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData(e.currentTarget);

      const orderData = {
         userId: session?.user?.id,
         customerName: formData.get("name"),
         customerPhone: formData.get("phone"),
         whatsappNumber: formData.get("whatsapp"),
         customerAddress: formData.get("address"),
         totalAmount: subtotal,

         // ✅ IMPORTANT: build from merged data
         items: cartItems.map((item) => ({
            productId: item.id,
            title: item.title,
            image: item.images?.[0],
            quantity: item.quantity,
            price: item.price,
         })),
      };

      try {
         await createOrder(orderData as any);
         clearCart();
         router.push("/checkout/success");
      } catch (err) {
         console.error(err);
         alert("Something went wrong.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="py-20 min-h-screen bg-gray-50/50">
         <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
               <div className="lg:col-span-12 mb-8">
                  <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors">
                     <ChevronLeft className="w-4 h-4" />
                     Abort Acquisition / Back to Catalog
                  </Link>
               </div>

               {/* Form Section */}
               <div className="lg:col-span-7 space-y-10">
                  <div className="space-y-2">
                     <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Finalize Order</h1>
                     <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">Gear Acquisition Unit - Morocco Central</p>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-12 bg-white p-12 rounded-[3rem] border border-border/40 shadow-xl shadow-black/5">
                     <div className="space-y-8">
                        <div className="flex items-center gap-4 text-accent border-b pb-4">
                           <UserPlus className="w-5 h-5" />
                           <h3 className="text-lg font-black uppercase tracking-tight italic">Recipient Information</h3>
                        </div>
                        <div className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest ml-1">Full Identity</Label>
                                 <Input id="name" name="name" defaultValue={session?.user?.name || ""} placeholder="John Doe" required className="h-12 rounded-xl focus-visible:ring-black" />
                              </div>
                              <div className="space-y-2">
                                 <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest ml-1">Direct Line / Phone</Label>
                                 <Input id="phone" name="phone" placeholder="+212 ..." required className="h-12 rounded-xl focus-visible:ring-black" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-widest ml-1 text-success flex items-center gap-2">
                                 <MessageSquare className="w-3.5 h-3.5" />
                                 WhatsApp Number (Required for confirmation)
                              </Label>
                              <Input id="whatsapp" name="whatsapp" placeholder="06..." required className="h-12 rounded-xl border-success/30 focus-visible:ring-success/50" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="flex items-center gap-4 text-muted-foreground border-b pb-4">
                           <Truck className="w-5 h-5 text-accent" />
                           <h3 className="text-lg font-black uppercase tracking-tight italic">Logistics / Delivery</h3>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest ml-1">Full Shipping Address (City, Quarter, House N°)</Label>
                           <Textarea id="address" name="address" placeholder="Rue Agdal, Casablanca, Morocco..." required className="min-h-[100px] rounded-2xl focus-visible:ring-black font-medium" />
                        </div>
                     </div>

                     <div className="bg-gray-50 p-6 rounded-2xl border flex items-start gap-4">
                        <CreditCard className="w-6 h-6 text-accent shrink-0 mt-1" />
                        <div>
                           <p className="text-sm font-black uppercase tracking-tight">Payment: Pay on Delivery (Maroc)</p>
                           <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground italic leading-relaxed pt-1">
                              Your gear will be dispatched for physical inspection and payment at your doorstep via Cash or TPE (Card).
                           </p>
                        </div>
                     </div>

                     <Button type="submit" disabled={loading} className="w-full h-16 bg-black hover:bg-black/90 text-white rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-black/20 transition-transform active:scale-[1.02]">
                        {loading ? "Transmitting to Logistics..." : "Launch Final Acquisition"}
                     </Button>
                  </form>
               </div>

               {/* Order Summary */}
               <div className="lg:col-span-5 relative">
                  <div className="sticky top-32 space-y-8">
                     <div className="bg-white p-10 rounded-[3rem] border border-border/40 space-y-8 shadow-sm">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic border-b pb-4">Acquisition Summary</h3>
                        <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                           {cartItems.map((item) => (
                              <div key={item.id} className="flex gap-4">
                                 <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border">
                                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                                 </div>
                                 <div className="flex-grow">
                                    <p className="text-[11px] font-black uppercase tracking-tight leading-tight italic line-clamp-1">{item.title}</p>
                                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{item.quantity} Unit(s)</p>
                                    <p className="text-[11px] font-black tracking-tighter mt-1">{(item.price * item.quantity).toLocaleString()} MAD</p>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <Separator className="bg-border/40" />

                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] uppercase font-black opacity-40 italic tracking-widest">
                              <span>Base Curation</span>
                              <span>{subtotal.toLocaleString()} MAD</span>
                           </div>
                           <div className="flex justify-between text-[10px] uppercase font-black text-success tracking-widest italic">
                              <span>Logistics (Morocco)</span>
                              <span>FREE EXPRESS</span>
                           </div>
                           <div className="flex justify-between items-center pt-4">
                              <span className="text-xl font-black uppercase tracking-tighter italic">Total Amount</span>
                              <span className="text-3xl font-black tracking-tighter text-accent italic">{subtotal.toLocaleString()} MAD</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-black text-white p-10 rounded-[3rem] flex items-center gap-6 group overflow-hidden relative">
                        <ShieldCheck className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                        <div className="space-y-2 relative z-10">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Safe Acquisition</h4>
                           <p className="text-[10px] uppercase font-black tracking-widest opacity-60 leading-relaxed italic">
                              Your order is transmitted directly to our logistics team in Casablanca. We do not store sensitive payment details.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Container>
      </div>
   );
}

function UserPlus(props: any) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
         <circle cx="9" cy="7" r="4" />
         <line x1="19" y1="8" x2="19" y2="14" />
         <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
   )
}
