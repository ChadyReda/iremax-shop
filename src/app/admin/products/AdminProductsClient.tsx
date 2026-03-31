"use client";

import { useState, useMemo } from "react";
import { deleteProduct } from "@/lib/actions/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { Trash2, Search, ArrowUpRight, Package, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  image: string;
  category: Category | null;
  stockStatus: string;
}

export default function AdminProductsClient({ 
  products: initialProducts, 
  categories, 
  collections 
}: { 
  products: Product[];
  categories: Category[];
  collections: Collection[];
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState(initialProducts);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !search || 
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.slug.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === "ALL" || 
        product.category?.name === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async (productId: string) => {
    if (confirm("Delete this product?")) {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-accent text-white rounded font-black uppercase text-[10px] tracking-widest px-3 h-6 border-none shadow-sm">Inventory</Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">Products</h1>
        </div>
        <ProductForm categories={categories} collections={collections} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border/40 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-10 sm:h-12 bg-white border border-border/60 rounded-xl pl-10 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black focus:border-black transition-all"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="h-10 sm:h-12 bg-white border border-border/60 rounded-xl px-3 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground whitespace-nowrap">
              {filteredProducts.length} items
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="border-none">
                <TableHead className="w-[60px] sm:w-[80px] text-[8px] sm:text-[10px] uppercase font-black tracking-widest h-12 sm:h-14 pl-4 sm:pl-8">Image</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest h-12 sm:h-14">Product</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest h-12 sm:h-14">Category</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest h-12 sm:h-14">Price</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest h-12 sm:h-14">Stock</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest h-12 sm:h-14 text-right pr-4 sm:pr-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} className="border-b border-border/30 hover:bg-gray-50/50 group transition-colors">
                  <TableCell className="pl-4 sm:pl-8 py-3 sm:py-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 border border-border/40 shadow-sm">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-black text-xs uppercase tracking-tight line-clamp-1 max-w-[120px] sm:max-w-none">{product.title}</p>
                      <p className="text-[8px] sm:text-[9px] text-muted-foreground font-black uppercase tracking-widest">slug: {product.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg border-2 border-border/60 text-[8px] sm:text-[9px] font-black uppercase tracking-widest h-5 sm:h-6 px-2 sm:px-3 bg-white">
                      {product.category?.name || 'General'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-black text-xs sm:text-sm tracking-tighter">{product.price.toLocaleString()} MAD</p>
                      {product.oldPrice && <p className="text-[8px] sm:text-[10px] text-muted-foreground line-through font-bold opacity-60 italic">{product.oldPrice.toLocaleString()} MAD</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                        product.stockStatus === 'in-stock' ? "bg-success" : 
                        product.stockStatus === 'low-stock' ? "bg-amber-500" : "bg-destructive"
                      )} />
                      <span className={cn(
                        "text-[8px] sm:text-[10px] uppercase font-black tracking-widest",
                        product.stockStatus === 'in-stock' ? "text-success" : 
                        product.stockStatus === 'low-stock' ? "text-amber-500" : "text-destructive"
                      )}>
                        {product.stockStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4 sm:pr-10">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <ProductForm product={product} categories={categories} collections={collections} />
                      <Link href={`/product/${product.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-gray-100 rounded-lg">
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-lg group"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 sm:h-40 text-center">
                    <div className="space-y-2">
                      <Package className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground/20 mx-auto" />
                      <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-muted-foreground">No products found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/40 flex items-center justify-between">
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 text-[10px] uppercase font-black tracking-widest"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 text-[10px] uppercase font-black tracking-widest"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}