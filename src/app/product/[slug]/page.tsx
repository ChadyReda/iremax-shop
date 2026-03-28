import { getProductBySlug } from "@/lib/actions/product";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
  ChevronRight,
  Info
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductReviews } from "@/components/product/ProductReviews";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="py-12 pb-32">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-12">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/category/${product.category.slug}`} className="hover:text-black transition-colors">{product.category.name}</Link>
          <ChevronRight className="w-3 h-3 text-accent" />
          <span className="text-black">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Main Hero Image */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-white border border-border/40 shadow-[0_40px_100px_rgba(0,0,0,0.08)] relative group">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-8 right-8 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-accent text-white border-none rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px]">New Gear</Badge>}
                {product.oldPrice && <Badge className="bg-success text-white border-none rounded-lg px-3 py-1 font-black uppercase tracking-widest text-[10px]">Special Offer</Badge>}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col h-full">
            <div className="space-y-8 pb-10 border-b border-border/40">
              <div className="space-y-3">
                <Badge variant="outline" className="text-accent border-accent font-black uppercase tracking-widest text-[10px] h-6 px-3">{product.category.name}</Badge>
                <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-[0.85]">{product.title}</h1>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-accent">
                  <Star className="w-5 h-5 fill-accent" />
                  <span className="text-lg font-black">{product.rating}</span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">{product.reviewsCount} Reviews</span>
                </div>
                <div className="w-px h-6 bg-border/40" />
                <div className="flex items-center gap-2 text-success">
                  <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">{product.stockStatus.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black tracking-tighter uppercase">{product.price.toLocaleString()} <span className="text-2xl">MAD</span></span>
                {product.oldPrice && (
                  <span className="text-2xl text-muted-foreground line-through font-bold italic opacity-30">{product.oldPrice.toLocaleString()} MAD</span>
                )}
              </div>

              <p className="text-muted-foreground text-sm uppercase font-black leading-relaxed tracking-tight border-l-8 border-accent pl-8 bg-gray-50/50 py-6 rounded-r-3xl">
                {product.description}
              </p>
            </div>

            <div className="py-10 space-y-12">
              <AddToCartButton product={product as any} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Truck, title: "Free Express Shipping", text: "Across Morocco Central" },
                  { icon: ShieldCheck, title: "Certified Authentic", text: "Distributor guarantee" },
                  { icon: RefreshCcw, title: "7-Day Inspection", text: "Risk-free evaluation" },
                  { icon: Info, title: "Pay on Delivery", text: "Cash or Card processing" }
                ].map((trust, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white border border-border/40 rounded-3xl group hover:shadow-xl transition-all hover:-translate-y-1">
                    <trust.icon className="w-7 h-7 text-accent shrink-0 transition-transform group-hover:rotate-12" />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest">{trust.title}</p>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight opacity-70 leading-tight">{trust.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-40">
          <ProductReviews product={product as any} />
        </div>
      </Container>
    </div>
  );
}

