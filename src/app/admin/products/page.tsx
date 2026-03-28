import { getProducts, getCategories, getCollections, deleteProduct } from "@/lib/actions/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { Trash2, Search, Filter, ArrowUpRight, MoreHorizontal, Package } from "lucide-react";


import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  const collections = await getCollections();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge className="bg-accent text-white rounded font-black uppercase text-[10px] tracking-widest px-3 h-6 border-none shadow-sm">Inventory</Badge>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Gear management</h1>
        </div>
        <ProductForm categories={categories} collections={collections} />

      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-border/40 overflow-hidden">
        <div className="p-8 border-b border-border/40 flex flex-wrap items-center gap-6 justify-between bg-gray-50/30">
           <div className="relative group max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input 
                placeholder="Filter by title, slug, or SKU..." 
                className="w-full h-12 bg-white border border-border/60 rounded-xl pl-12 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
              />
           </div>
           
           <div className="flex items-center gap-3">
              <Button variant="outline" className="h-12 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 px-6">
                <Filter className="w-4 h-4" />
                Filter by Category
              </Button>
              <div className="h-12 w-px bg-border/40" />
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground italic">Showing {products.length} Items</p>
           </div>
        </div>

        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="border-none">
              <TableHead className="w-[80px] text-[10px] uppercase font-black tracking-widest h-14 pl-8">Image</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest h-14">Product Name</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest h-14">Category</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest h-14">Pricing</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest h-14">In-Stock</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest h-14 text-right pr-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-b border-border/30 hover:bg-gray-50/50 group transition-colors">
                <TableCell className="pl-8 py-5">
                   <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-border/40 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                   </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-black text-sm uppercase tracking-tight leading-tight line-clamp-1">{product.title}</p>
                    <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">slug: {product.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg border-2 border-border/60 text-[9px] font-black uppercase tracking-widest h-6 px-3 bg-white">
                    {product.category?.name || 'General'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-black text-sm tracking-tighter">{product.price.toLocaleString()} MAD</p>
                    {product.oldPrice && <p className="text-[10px] text-muted-foreground line-through font-bold opacity-60 italic">{product.oldPrice.toLocaleString()} MAD</p>}
                  </div>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        product.stockStatus === 'in-stock' ? "bg-success" : 
                        product.stockStatus === 'low-stock' ? "bg-amber-500" : "bg-destructive"
                      )} />
                      <span className={cn(
                        "text-[10px] uppercase font-black tracking-widest",
                        product.stockStatus === 'in-stock' ? "text-success" : 
                        product.stockStatus === 'low-stock' ? "text-amber-500" : "text-destructive"
                      )}>
                        {product.stockStatus.replace('-', ' ')}
                      </span>
                   </div>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex items-center justify-end gap-2">
                    <ProductForm product={product} categories={categories} collections={collections} />

                    <Link href={`/product/${product.slug}`} target="_blank">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:bg-gray-100 rounded-lg">
                          <ArrowUpRight className="w-4 h-4" />
                       </Button>
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteProduct(product.id);
                    }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-lg group">
                        <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                 <TableCell colSpan={6} className="h-40 text-center">
                    <div className="space-y-2">
                       <Package className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                       <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">No gear registered yet.</p>
                    </div>
                 </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <div className="p-8 bg-gray-50/50 border-t border-border/40 flex items-center justify-between">
           <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground italic">Central Inventory Management System Pro</p>
           <div className="flex gap-2">
              <Button disabled variant="outline" className="h-10 border-2 rounded-lg text-[10px] font-black uppercase tracking-widest px-6 shadow-sm">Previous</Button>
              <Button disabled variant="outline" className="h-10 border-2 rounded-lg text-[10px] font-black uppercase tracking-widest px-6 shadow-sm">Next Page</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
