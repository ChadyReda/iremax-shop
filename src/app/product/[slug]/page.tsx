import { getProductBySlug } from "@/lib/actions/product";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Star,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Info
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductReviews } from "@/components/product/ProductReviews";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="py-8 pb-20">
      <Container>
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-black">{product.category.name}</Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.isNew && <Badge className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3">New</Badge>}
          </div>

          <div className="flex flex-col">
            <div className="space-y-4 pb-6 border-b">
              <Badge variant="outline" className="text-accent border-accent text-xs font-bold w-fit">{product.category.name}</Badge>
              <h1 className="text-3xl lg:text-4xl font-black uppercase">{product.title}</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviewsCount})</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <span className="text-xs font-bold text-green-600 uppercase">{product.stockStatus.replace('-', ' ')}</span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">${product.oldPrice.toLocaleString()}</span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="py-6 space-y-6">
              <AddToCartButton product={product as any} />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, title: "Free Shipping", text: "Across Morocco" },
                  { icon: ShieldCheck, title: "Authentic", text: "Distributor guarantee" },
                  { icon: RefreshCcw, title: "7-Day Return", text: "Risk-free" },
                  { icon: Info, title: "COD", text: "Cash or Card" }
                ].map((trust, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <trust.icon className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <p className="text-xs font-bold">{trust.title}</p>
                      <p className="text-[10px] text-gray-500">{trust.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <ProductReviews product={product as any} />
        </div>
      </Container>
    </div>
  );
}

