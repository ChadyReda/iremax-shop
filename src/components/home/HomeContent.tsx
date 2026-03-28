"use client";

import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Zap } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Usb charger",
    image: "/hero-1.jpg",
    link: "/product/usb-charger",
    color: "#fff700ff",
  },
  {
    id: 2,
    name: "Canon EOS R5",
    image: "/hero-2.jpg",
    link: "/product/canon-r5",
    color: "#ccffa5ff",
  },
  {
    id: 3,
    name: "Nikon Z6 II",
    image: "/hero-3.jpg",
    link: "/product/nikon-z6",
    color: "#ffffffff",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Auto switch
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = products[index];

  return (
    <section className="relative h-[650px] lg:h-[750px] w-full overflow-hidden bg-black">
      {/* 🔥 Background */}
      <AnimatePresence mode="wait">
        <motion.img
          key={current.image}
          src={current.image}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>

      {/* 🔥 Content */}
      <div className="relative h-full flex items-center px-8 md:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6 max-w-xl"
          >
            <h1
              style={{
                color: current.color,
                textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              }}
              className="text-5xl lg:text-6xl font-black uppercase italic"
            >
              {current.name}
            </h1>

            <p
              style={{
                color: current.color,
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
              className="uppercase text-sm tracking-widest opacity-80"
            >
              Premium Mirrorless Camera
            </p>

            <a
              href={current.link}
              style={{ backgroundColor: current.color, color: "#000" }}
              className="inline-block px-8 py-4 font-bold rounded-lg shadow-xl transition"
            >
              View Product →
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 🔥 Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
          />
        ))}
      </div>
    </section>
  );
}


interface HomeContentProps {
  mainCategories: any[];
  collections: (any & { products: any[] })[];
}


export function HomeContent({ mainCategories, collections }: HomeContentProps) {

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <Hero />

      {/* Categories Grid (Bento) */}
      <Container>
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-accent border-accent font-bold uppercase tracking-widest text-[10px]">Departments</Badge>
              <h2 className="text-4xl font-extrabold tracking-tighter uppercase italic">Browse Categories</h2>
            </div>
            <Link href="/category/all" className="text-sm font-bold flex items-center text-muted-foreground hover:text-black transition-colors uppercase gap-2 group underline-offset-4 active:text-accent">
              View All Categories <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 h-[600px] gap-3">
            {mainCategories.length > 0 ? (
              mainCategories.map((cat, idx) => {
                const isWide = idx === 0;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={cn(
                      "relative group overflow-hidden transition-all duration-300",
                      "hover:shadow-xl hover:shadow-black/20",
                      isWide ? "md:col-span-2 md:row-span-2" : "md:col-span-2 md:row-span-1"
                    )}
                  >
                    <div className="relative w-full h-full">

                      {/* Image */}
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* ✨ Sweep Effect */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="sweep-light" />
                      </div>

                      {/* Text */}
                      <div
                        className={cn(
                          "absolute left-10 space-y-3",
                          isWide ? "bottom-10" : "bottom-8"
                        )}
                      >
                        <h3
                          className={cn(
                            "font-black text-white uppercase tracking-tighter leading-none",
                            isWide ? "text-5xl" : "text-3xl"
                          )}
                        >
                          {cat.name}
                        </h3>
                        <p className="text-white/60 text-sm max-w-xs font-medium uppercase tracking-widest">
                          {cat.description || `Explore our ${cat.name} collection`}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-full flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-border/50 h-full">
                <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground/40">No categories are listed</p>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Dynamic Collections */}
      {collections.map((collection, idx) => (
        <Container key={collection.id}>
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b pb-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">{collection.name}</h2>
                <div className="flex items-center gap-2 text-accent">
                  <Zap className="w-4 h-4 fill-accent" />
                  <span className="text-xs font-black uppercase tracking-widest">Premium Selection</span>
                </div>
              </div>
              <Link href={`/category/all?collection=${collection.slug}`} className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors font-black">
                Explore The Collection
              </Link>
            </div>
            <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-8 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {collection.products.length > 0 ? (
                collection.products.map((product: Product) => (
                  <div key={product.id} className="w-[280px] sm:w-[320px] lg:w-auto shrink-0 snap-center">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="col-span-full py-20 text-center text-muted-foreground uppercase font-black text-xs tracking-widest italic opacity-30">
                  New inventory arriving soon...
                </p>
              )}
            </div>
          </div>
        </Container>
      ))}


      {/* Trust & Conversion Section */}
      <section className="bg-gray-100/50 py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-success text-white border-none rounded">Verified Excellence</Badge>
              <h2 className="text-5xl font-black tracking-tighter leading-none uppercase italic underline decoration-accent/40 decoration-4 underline-offset-8">Why Professionals Choose Us</h2>
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: "Industry Standard Gear", text: "We only stock the most reliable and performance-driven equipment used by top pros." },
                  { icon: Star, title: "Expert Support", text: "Our staff consists of professional gear experts who are available 24/7." },
                  { icon: ArrowRight, title: "Lightning Fast Delivery", text: "Get your gear when you need it with our premium expedited shipping options." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm border border-border/40 flex items-center justify-center text-accent transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg tracking-tight uppercase italic">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed uppercase tracking-tight opacity-70">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-video lg:aspect-square bg-gray-200 rounded-[3rem] overflow-hidden shadow-2xl group border-[10px] border-white ring-1 ring-black/5">
              <img src="https://imgs.search.brave.com/kwHMpc5S9-Ra4tAc1pZEg43p55H1rmKjmxfYjB45SJQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aXJlbWF4dXNhLmNv/bS9jZG4vc2hvcC9w/cm9kdWN0cy9BRV8y/MDQ4eC5qcGc_dj0x/NTUyMDgwNTMw" alt="Studio setup" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
