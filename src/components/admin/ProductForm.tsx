"use client";

import { useState, useRef } from "react";
import { createProduct, updateProduct, getCategories } from "@/lib/actions/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Check,
  Loader2,
  Image as ImageIcon,
  Upload,
  X
} from "lucide-react";
import { uploadImageAction } from "@/lib/actions/upload";
import Image from "next/image";

interface ProductFormProps {
  product?: any;
  categories: any[];
  collections: any[];
  onSuccess?: () => void;
}

export function ProductForm({ product, categories, collections, onSuccess }: ProductFormProps) {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(product?.image || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      let imageUrl = product?.image || "";

      // If a new file is selected, upload it via server action
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("bucket", "products");
        imageUrl = await uploadImageAction(uploadData);
      }

      if (!imageUrl && !product?.image) {
        alert("Please upload an image first.");
        setLoading(false);
        return;
      }

      const data = {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string).toLowerCase().replace(/ /g, "-"),
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        oldPrice: formData.get("oldPrice") ? parseFloat(formData.get("oldPrice") as string) : undefined,
        image: imageUrl,
        categoryId: formData.get("categoryId") || undefined,
        collectionId: formData.get("collectionId") || undefined,
        stockStatus: formData.get("stockStatus") as string,
      };

      if (product) {
        await updateProduct(product.id, data as any);
      } else {
        await createProduct(data as any);
      }
      setOpen(false);
      onSuccess?.();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setSelectedFile(null);
        setPreviewUrl(product?.image || null);
      }
    }}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:text-accent group">
            <Edit className="w-4 h-4 transition-transform group-hover:scale-110" />
          </Button>
        ) : (
          <Button className="h-10 bg-black hover:bg-black/90 text-white rounded-lg font-black uppercase text-[10px] tracking-widest gap-2">
            <Plus className="w-4 h-4" />
            Add New Gear
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">
            {product ? "Update Inventory" : "Register Product"}
          </DialogTitle>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Management Console</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Product Title</Label>
              <Input id="title" name="title" defaultValue={product?.title} required className="h-12 rounded-xl focus-visible:ring-black border-border shadow-sm placeholder:text-muted-foreground/30 font-bold" placeholder="E.g. Sony Alpha a7 IV" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Main Category</Label>
              <select name="categoryId" className="w-full h-12 bg-white border border-border rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black shadow-sm" defaultValue={product?.categoryId || ""}>
                <option value="">No Category (Uncategorized)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectionId" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Special Set / Collection (Optional)</Label>
            <select name="collectionId" className="w-full h-12 bg-white border border-border rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-black shadow-sm" defaultValue={product?.collectionId || ""}>
              <option value="">No Collection</option>
              {collections.map((coll) => (
                <option key={coll.id} value={coll.id}>{coll.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Creative Story/Description</Label>
            <Textarea id="description" name="description" defaultValue={product?.description} required className="min-h-[100px] rounded-xl focus-visible:ring-black resize-none border-border shadow-sm font-medium" placeholder="Describe the professional benefits..." />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">MSRP (MAD)</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required className="h-12 rounded-xl focus-visible:ring-black font-black" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oldPrice" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">List Price (Optional)</Label>
              <Input id="oldPrice" name="oldPrice" type="number" step="0.01" defaultValue={product?.oldPrice} className="h-12 rounded-xl focus-visible:ring-black font-medium opacity-60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockStatus" className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Inventory State</Label>
              <select name="stockStatus" className="w-full h-12 bg-white border border-border rounded-xl px-4 text-sm font-bold focus:outline-none shadow-sm" defaultValue={product?.stockStatus || "in-stock"}>
                <option value="in-stock">In-Stock</option>
                <option value="low-stock">Low-Stock</option>
                <option value="out-of-stock">Out-of-Stock</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground flex items-center justify-between">
              Product Visualization
              <ImageIcon className="w-3.5 h-3.5" />
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-black hover:bg-gray-50 transition-all group h-[200px]"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-muted-foreground group-hover:text-black" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest">Select Image</p>
                  <p className="text-[9px] text-muted-foreground font-medium uppercase mt-1">PNG, JPG or WebP (Max 5MB)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              <div className="relative border-2 border-border rounded-2xl h-[200px] overflow-hidden bg-gray-50 flex items-center justify-center group">
                {previewUrl ? (
                  <>
                    <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 w-8 h-8 bg-white border shadow-xl rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {selectedFile && (
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full">
                        <p className="text-[8px] text-white font-black uppercase tracking-widest">Pending Upload</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                    <ImageIcon className="w-12 h-12" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Selection</p>
                  </div>
                )}
              </div>
            </div>
          </div>


          <DialogFooter className="pt-6 border-t font-black">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-12 font-black uppercase tracking-widest text-[10px]">Cancel</Button>
            <Button type="submit" disabled={loading} className="h-12 bg-black hover:bg-black/90 text-white rounded-xl px-10 font-black uppercase tracking-widest text-xs gap-2 transition-transform active:scale-95 shadow-xl shadow-black/10">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {product ? "Apply Changes" : "Commit to Inventory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

