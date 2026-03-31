"use client";

import Link from "next/link";
import { ArrowRight, Star, TrendingUp, Zap } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useState, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Usb charger",
    image: "/hero-1.jpg",
    link: "/product/samsung-45w-usb-c-charger",
    color: "#fff700ff",
  },
  {
    id: 2,
    name: "TWS Earphones",
    image: "/hero-2.jpg",
    link: "/product/tws-earphones",
    color: "#ccffa5ff",
  },
  {
    id: 3,
    name: "Usb drive",
    image: "/hero-3.jpg",
    link: "/product/xiaomi-10000mah-22-5w",
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
    <section className="relative h-[400px] lg:h-[550px] w-full overflow-hidden bg-black">
      <img
        src={current.image}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative h-full flex items-center px-6 md:px-12">
        <div className="space-y-4 max-w-lg">
          <h1
            style={{ color: current.color }}
            className="text-3xl lg:text-5xl font-black uppercase"
          >
            {current.name}
          </h1>

          <p
            style={{ color: current.color }}
            className="uppercase text-xs tracking-widest opacity-80"
          >
            Premium Mirrorless Camera
          </p>

          <a
            href={current.link}
            style={{ backgroundColor: current.color, color: "#000" }}
            className="inline-block px-6 py-3 font-bold rounded-lg transition-opacity hover:opacity-90"
          >
            View Product
          </a>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/40"
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
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-accent border-accent font-bold uppercase tracking-widest text-xs">Departments</Badge>
              <h2 className="text-2xl lg:text-3xl font-extrabold uppercase">Browse Categories</h2>
            </div>
            <Link href="/category/all" className="text-sm font-bold flex items-center text-muted-foreground hover:text-black transition-colors uppercase gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainCategories.length > 0 ? (
              mainCategories.map((cat, idx) => {
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="relative group overflow-hidden rounded-2xl aspect-[4/3]"
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      <div className="absolute left-6 bottom-6">
                        <h3 className="font-black text-white text-xl uppercase">
                          {cat.name}
                        </h3>
                        <p className="text-white/60 text-xs">
                          {cat.description || `Explore`}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-full flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-border/50 py-12">
                <p className="font-black uppercase tracking-widest text-xs text-muted-foreground/40">No categories are listed</p>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Dynamic Collections */}
      {collections.map((collection, idx) => (
        <Container key={collection.id}>
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl lg:text-3xl font-black uppercase">{collection.name}</h2>
                <div className="flex items-center gap-2 text-accent">
                  <Zap className="w-4 h-4 fill-accent" />
                  <span className="text-xs font-black uppercase tracking-widest">Premium Selection</span>
                </div>
              </div>
              <Link href={`/category/all?collection=${collection.slug}`} className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors">
                Explore
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {collection.products.length > 0 ? (
                collection.products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="col-span-full py-12 text-center text-muted-foreground uppercase font-black text-xs tracking-widest italic opacity-30">
                  New inventory arriving soon...
                </p>
              )}
            </div>
          </div>
        </Container>
      ))}


      {/* Trust & Conversion Section */}
      <section className="bg-gray-50 py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-success text-white border-none rounded">Verified Excellence</Badge>
              <h2 className="text-2xl lg:text-3xl font-black uppercase">Why Professionals Choose Us</h2>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, title: "Industry Standard Gear", text: "We only stock the most reliable equipment used by top pros." },
                  { icon: Star, title: "Expert Support", text: "Our staff consists of gear experts available 24/7." },
                  { icon: ArrowRight, title: "Fast Delivery", text: "Get your gear when you need it with expedited shipping." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl border flex items-center justify-center text-accent">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-video lg:aspect-square bg-gray-200 rounded-2xl overflow-hidden">
              <img src="https://imgs.search.brave.com/kwHMpc5S9-Ra4tAc1pZEg43p55H1rmKjmxfYjB45SJQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aXJlbWF4dXNhLmNv/bS9jZG4vc2hvcC9w/cm9kdWN0cy9BRV8y/MDQ4eC5qcGc_dj0x/NTUyMDgwNTMw" alt="Studio setup" className="w-full h-full object-cover" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
