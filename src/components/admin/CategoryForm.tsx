"use client";

import { useState, useRef } from "react";
import { createCategory, updateCategory } from "@/lib/actions/product";
import toast from "react-hot-toast";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Check, Loader2, Image as ImageIcon, Upload, X } from "lucide-react";
import { uploadImageAction } from "@/lib/actions/upload";
import Image from "next/image";

export function CategoryForm({ category, onSuccess }: { category?: any; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(category?.image || null);
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
    setPreviewUrl(category?.image || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      let imageUrl = category?.image || "";

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("bucket", "categories");
        imageUrl = await uploadImageAction(uploadData);
      }

      const data = {
        name: formData.get("name") as string,
        slug: (formData.get("name") as string).toLowerCase().replace(/ /g, "-"),
        description: formData.get("description") as string,
        image: imageUrl,
        isMain: formData.get("isMain") === "on",
      };

      let result;

      if (category) {
        result = await updateCategory(category.id, data);
      } else {
        result = await createCategory(data);
      }

      if ("error" in result && result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Category saved successfully");
      setOpen(false);
      onSuccess?.();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during upload or save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setSelectedFile(null);
        setPreviewUrl(category?.image || null);
      }
    }}>
      <DialogTrigger asChild>
        {category ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:text-accent group">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="h-10 bg-black hover:bg-black/90 text-white rounded-lg font-black uppercase text-[10px] tracking-widest gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">
            {category ? "Modify Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category Name</Label>
            <Input id="name" name="name" defaultValue={category?.name} required className="h-12 rounded-xl focus-visible:ring-black font-bold" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</Label>
            <Textarea id="description" name="description" defaultValue={category?.description} className="min-h-[80px] rounded-xl focus-visible:ring-black" />
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
              Category Visual
              <ImageIcon className="w-3.5 h-3.5" />
            </Label>
            
            <div className="grid grid-cols-1 gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-black hover:bg-gray-50 transition-all group h-[120px]"
              >
                <Upload className="w-4 h-4 text-muted-foreground group-hover:text-black" />
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest">Select Image</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              {previewUrl && (
                <div className="relative border-2 border-border rounded-2xl h-[120px] overflow-hidden bg-gray-50 flex items-center justify-center group">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-6 h-6 bg-white border shadow-lg rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-xl border">
            <Checkbox id="isMain" name="isMain" defaultChecked={category?.isMain} />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="isMain" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Show on Home Page</label>
              <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight">Only top 3 marked categories will appear in the home grid.</p>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-12 font-black uppercase text-[10px]">Cancel</Button>
            <Button type="submit" disabled={loading} className="h-12 bg-black hover:bg-black/90 text-white rounded-xl px-10 font-black uppercase text-xs gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

