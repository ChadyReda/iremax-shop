"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  ChevronDown, 
  ArrowUpDown,
  Package,
  X
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/product/ProductCard";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CategoryContentProps {
  initialProducts: any[];
  categories: any[];
  currentSlug: string;
}

export function CategoryContent({ initialProducts, categories, currentSlug }: CategoryContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [stockOnly, setStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesStock = !stockOnly || p.stockStatus === "in-stock";
      
      return matchesSearch && matchesPrice && matchesStock;
    }).sort((a, b) => {
      if (activeSort === "price-asc") return a.price - b.price;
      if (activeSort === "price-desc") return b.price - a.price;
      if (activeSort === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [initialProducts, searchQuery, priceRange, stockOnly, activeSort]);

  const categoryTitle = currentSlug === "all" ? "All Equipment" : currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1);

  return (
    <div className="py-12 pb-32">
      <Container>
        <div className="flex flex-col gap-12">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Home</span>
              <ChevronDown className="-rotate-90 w-3 h-3" />
              <span className="text-black">Catalog</span>
              <ChevronDown className="-rotate-90 w-3 h-3 text-accent" />
              <span className="text-accent">{categoryTitle}</span>
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">{categoryTitle}</h1>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Showing {filteredProducts.length} Premium results</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 space-y-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Categories</h3>
                <div className="flex flex-col gap-2">
                  <a href="/category/all" className={cn("text-xs font-black uppercase tracking-widest", currentSlug === "all" ? "text-accent" : "text-muted-foreground hover:text-black")}>All</a>
                  {categories?.map((cat) => (
                    <a key={cat.id} href={`/category/${cat.slug}`} className={cn("text-xs font-black uppercase tracking-widest", currentSlug === cat.slug ? "text-accent" : "text-muted-foreground hover:text-black")}>
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" /> Search Catalog
                </h3>
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model, lens type..." 
                    className="w-full h-12 bg-gray-50 border-none rounded-xl pl-4 pr-10 text-xs font-black uppercase tracking-widest focus:ring-1 focus:ring-accent transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Price Range (MAD)</h3>
                <Slider max={10000} step={100} value={priceRange} onValueChange={setPriceRange} className="py-4" />
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest font-mono italic">
                  <span>{priceRange[0]} MAD</span>
                  <span className="w-12 h-px bg-border/40 mx-2" />
                  <span>{priceRange[1]} MAD</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Availability</h3>
                <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setStockOnly(!stockOnly)}>
                  <Checkbox checked={stockOnly} onCheckedChange={(checked) => setStockOnly(!!checked)} id="stock" className="data-[state=checked]:bg-accent data-[state=checked]:border-accent rounded-md w-5 h-5" />
                  <label htmlFor="stock" className="text-[11px] font-black uppercase tracking-widest cursor-pointer select-none">Show In-Stock Only</label>
                </div>
              </div>

              <Button variant="ghost" className="w-full h-12 rounded-xl border border-dashed border-border/60 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors" onClick={() => {
                setPriceRange([0, 10000]); setStockOnly(false); setSearchQuery(""); setActiveSort("featured");
              }}>
                Reset All Filters
              </Button>
            </aside>

            {/* Results */}
            <main className="lg:col-span-3 space-y-8">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
                <div className="flex items-center gap-3">
                  <Badge className="bg-black text-white rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">{filteredProducts.length}</Badge>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Items Found</span>
                </div>

                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-gray-50">
                        <ArrowUpDown className="w-4 h-4" />
                        Sort: {activeSort.replace('-', ' ')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white rounded-xl border-none shadow-2xl p-2 min-w-[200px]">
                      {[{id:"featured",label:"Recommended"},{id:"price-asc",label:"Price (Low)"},{id:"price-desc",label:"Price (High)"},{id:"rating",label:"Top Rated"}].map((sort) => (
                        <DropdownMenuItem key={sort.id} onClick={() => setActiveSort(sort.id)} className={cn("rounded-lg font-black uppercase tracking-widest text-[9px] py-2.5 px-4 cursor-pointer", activeSort === sort.id ? "bg-accent text-white" : "hover:bg-gray-50 hover:text-accent")}>
                          {sort.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="h-[400px] bg-gray-50/50 rounded-[3rem] border border-dashed border-border/40 flex flex-col items-center justify-center gap-4">
                  <Package className="w-16 h-16 text-muted-foreground/20" />
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No equipment matches your search criteria.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </Container>
    </div>
  );
}
