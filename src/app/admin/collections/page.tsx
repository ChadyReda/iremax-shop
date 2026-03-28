import { getCollections, deleteCollection } from "@/lib/actions/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { Trash2, Layers, Tag } from "lucide-react";

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge className="bg-accent text-white rounded font-black uppercase text-[10px] tracking-widest px-3 h-6 border-none shadow-sm">Collections</Badge>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Curation Sets</h1>
        </div>
        <CollectionForm />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-border/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="pl-8 text-[10px] uppercase font-black">Visual Tag</TableHead>
              <TableHead className="text-[10px] uppercase font-black">Set Label</TableHead>
              <TableHead className="text-[10px] uppercase font-black">Ref/Slug</TableHead>
              <TableHead className="text-[10px] uppercase font-black text-right pr-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collections.map((coll) => (
              <TableRow key={coll.id}>
                <TableCell className="pl-8 py-5">
                   <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-gray-50">
                      <Tag className="w-5 h-5 text-accent opacity-40 shrink-0" />
                   </div>
                </TableCell>
                <TableCell>
                  <p className="font-black text-sm uppercase tracking-tight italic text-accent">{coll.name}</p>
                </TableCell>
                <TableCell>
                   <code className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-muted-foreground uppercase">{coll.slug}</code>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex items-center justify-end gap-2">
                    <CollectionForm collection={coll} />
                    <form action={async () => {
                      "use server";
                      await deleteCollection(coll.id);
                    }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
