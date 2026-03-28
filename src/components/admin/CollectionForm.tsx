"use client";

import { useState } from "react";
import { createCollection, updateCollection } from "@/lib/actions/product";
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
import { Plus, Edit, Check, Loader2, Layers } from "lucide-react";

export function CollectionForm({ collection, onSuccess }: { collection?: any; onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: (formData.get("name") as string).toLowerCase().replace(/ /g, "-"),
    };

    try {
      if (collection) {
        await updateCollection(collection.id, data);
      } else {
        await createCollection(data);
      }
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {collection ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-black hover:text-accent group">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="h-10 bg-black hover:bg-black/90 text-white rounded-lg font-black uppercase text-[10px] tracking-widest gap-2">
            <Plus className="w-4 h-4" />
            Add Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">
            {collection ? "Modify Set" : "New Collection"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Collection Label</Label>
            <Input id="name" name="name" defaultValue={collection?.name} required className="h-12 rounded-xl focus-visible:ring-black font-black uppercase" placeholder="E.G. EXTREME SAVINGS" />
          </div>

          <DialogFooter className="pt-6 border-t flex flex-col gap-2">
            <Button type="submit" disabled={loading} className="w-full h-12 bg-black hover:bg-black/90 text-white rounded-xl px-10 font-black uppercase text-xs gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              Finalize Collection
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-10 font-black uppercase text-[10px] opacity-40">Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
