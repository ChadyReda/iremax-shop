"use client";

import { useState, useMemo } from "react";
import { 
  Package, 
  X,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CategoryContentProps {
  initialProducts: any[];
  categories: any[];
  currentSlug: string;
}

interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  stockOnly: boolean;
  setStockOnly: (value: boolean) => void;
  priceRanges: { value: string; label: string }[];
  currentSlug: string;
  categories: any[];
  setActiveSort: (value: string) => void;
}

function FilterSection({ 
  searchQuery, 
  setSearchQuery, 
  priceRange, 
  setPriceRange, 
  stockOnly, 
  setStockOnly, 
  priceRanges, 
  currentSlug, 
  categories,
  setActiveSort 
}: FilterSectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase">Categories</h3>
        <div className="flex flex-wrap gap-1.5">
          <a href="/category/all" className={cn("text-xs font-medium px-2 py-1.5 rounded", currentSlug === "all" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200")}>All</a>
          {categories?.map((cat) => (
            <a key={cat.id} href={`/category/${cat.slug}`} className={cn("text-xs font-medium px-2 py-1.5 rounded", currentSlug === cat.slug ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200")}>
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase">Search</h3>
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..." 
            className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 pr-8 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase">Price Range</h3>
        <select 
          value={priceRange} 
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-xs focus:outline-none focus:border-black"
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={stockOnly} 
            onChange={(e) => setStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="text-xs font-medium">In Stock Only</span>
        </label>
      </div>

      <Button variant="outline" className="w-full text-xs h-9" onClick={() => {
        setPriceRange("all"); setStockOnly(false); setSearchQuery(""); setActiveSort("featured");
      }}>
        Reset Filters
      </Button>
    </div>
  );
}

export function CategoryContent({ initialProducts, categories, currentSlug }: CategoryContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [stockOnly, setStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-200", label: "0 - 200 MAD" },
    { value: "200-500", label: "200 - 500 MAD" },
    { value: "500-1000", label: "500 - 1000 MAD" },
    { value: "1000-10000", label: "1000+ MAD" },
  ];

  const getPriceRange = (value: string) => {
    switch (value) {
      case "0-200": return [0, 200];
      case "200-500": return [200, 500];
      case "500-1000": return [500, 1000];
      case "1000-10000": return [1000, 10000];
      default: return [0, 10000];
    }
  };

  const filteredProducts = useMemo(() => {
    const range = getPriceRange(priceRange);
    return initialProducts.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= range[0] && p.price <= range[1];
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
    <div className="py-8 pb-20">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase">{categoryTitle}</h1>
            <p className="text-sm text-gray-500">{filteredProducts.length} results</p>
          </div>

          <div className="lg:hidden">
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </span>
                  <ChevronRight className={cn("w-4 h-4 transition-transform", filtersOpen && "rotate-90")} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <FilterSection 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  stockOnly={stockOnly}
                  setStockOnly={setStockOnly}
                  priceRanges={priceRanges}
                  currentSlug={currentSlug}
                  categories={categories}
                  setActiveSort={setActiveSort}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block">
              <FilterSection 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                stockOnly={stockOnly}
                setStockOnly={setStockOnly}
                priceRanges={priceRanges}
                currentSlug={currentSlug}
                categories={categories}
                setActiveSort={setActiveSort}
              />
            </aside>

            <main className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-black text-white rounded text-xs">{filteredProducts.length}</Badge>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 text-xs">
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[{id:"featured",label:"Recommended"},{id:"price-asc",label:"Price: Low"},{id:"price-desc",label:"Price: High"},{id:"rating",label:"Top Rated"}].map((sort) => (
                      <DropdownMenuItem key={sort.id} onClick={() => setActiveSort(sort.id)} className={cn("text-xs", activeSort === sort.id && "bg-gray-100")}>
                        {sort.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-gray-50 rounded-xl flex flex-col items-center justify-center gap-2">
                  <Package className="w-10 h-10 text-gray-300" />
                  <p className="text-xs font-medium text-gray-500">No products found</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </Container>
    </div>
  );
}
