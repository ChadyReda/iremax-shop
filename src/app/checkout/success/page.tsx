"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, Truck, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";

export default function OrderSuccessPage() {
   const clearCart = useCartStore((state) => state.clearCart);

   useEffect(() => {
      clearCart();
   }, [clearCart]);

   return (
      <div className="py-20 min-h-screen flex items-center bg-gray-50/50">
         <Container className="max-w-4xl">
            <motion.div


               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white p-16 md:p-24 rounded-[4rem] text-center space-y-12 border border-border/40 shadow-2xl relative overflow-hidden group"
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-success opacity-20" />
               <div className="w-24 h-24 bg-success/10 rounded-[2.5rem] mx-auto flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-12 h-12 text-success shrink-0" />
               </div>

               <div className="space-y-4">
                  <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">Acquisition Registered</h1>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60 italic leading-relaxed">Your professional order has been transmitted to our central dispatch.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-2 border border-border/40 hover:bg-white hover:shadow-lg transition-all">
                     <MessageSquare className="w-6 h-6 text-accent mx-auto" />
                     <p className="text-[10px] font-black uppercase tracking-widest mt-2">WhatsApp Confirmation</p>
                     <p className="text-[9px] text-muted-foreground font-black tracking-tight leading-relaxed italic opacity-70">Our logistics team will contact you shortly to confirm acquisition details.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-2 border border-border/40 hover:bg-white hover:shadow-lg transition-all">
                     <Truck className="w-6 h-6 text-accent mx-auto" />
                     <p className="text-[10px] font-black uppercase tracking-widest mt-2">Fast Logistics</p>
                     <p className="text-[9px] text-muted-foreground font-black tracking-tight leading-relaxed italic opacity-70">Expect express dispatch within 24-48 hours across Morocco Central.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-2 border border-border/40 hover:bg-white hover:shadow-lg transition-all">
                     <Star className="w-6 h-6 text-accent mx-auto" />
                     <p className="text-[10px] font-black uppercase tracking-widest mt-2">VIP Support</p>
                     <p className="text-[9px] text-muted-foreground font-black tracking-tight leading-relaxed italic opacity-70">Premium support and tracking will be provided via your direct WhatsApp line.</p>
                  </div>
               </div>

               <div className="pt-12 flex flex-col md:flex-row gap-4 justify-center items-center">
                  <Link href="/profile" className="w-full md:w-auto">
                     <Button variant="outline" className="w-full md:w-[250px] h-14 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">Back to profile</Button>
                  </Link>
                  <Link href="/" className="w-full md:w-auto">
                     <Button className="w-full md:w-[250px] h-14 bg-black hover:bg-black/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">Continue Shoping <ArrowRight className="w-4 h-4" /></Button>
                  </Link>
               </div>

               <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 italic">Safe Commerce Morocco - Professional Distribution</p>
            </motion.div>
         </Container>
      </div>
   );
}
