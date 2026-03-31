import { getCategories, deleteCategory } from "@/lib/actions/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Trash2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge className="bg-accent text-white rounded font-black uppercase text-[10px] tracking-widest px-3 h-6 border-none shadow-sm">Classification</Badge>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic leading-none">Categories</h1>
        </div>
        <CategoryForm />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow>
                <TableHead className="pl-4 sm:pl-8 text-[8px] sm:text-[10px] uppercase font-black">Icon/Visual</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black">Category Name</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black text-center">Home Status</TableHead>
                <TableHead className="text-[8px] sm:text-[10px] uppercase font-black text-right pr-4 sm:pr-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="pl-4 sm:pl-8 py-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border flex items-center justify-center bg-gray-50">
                      {cat.image ? (
                        <img src={cat.image} className="w-full h-full object-cover rounded-xl" alt="" />
                      ) : (
                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-black text-xs sm:text-sm uppercase tracking-tight">{cat.name}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    {cat.isMain ? (
                      <Badge className="bg-success/10 text-success border-none font-black text-[8px] sm:text-[9px] uppercase gap-1 px-2 sm:px-3">
                        <CheckCircle2 className="w-3 h-3" />
                        Main
                      </Badge>
                    ) : (
                      <span className="text-[8px] sm:text-[10px] uppercase font-black text-muted-foreground opacity-30 italic">Sub</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-4 sm:pr-10">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <CategoryForm category={cat} />
                      <form action={async () => {
                        "use server";
                        await deleteCategory(cat.id);
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
    </div>
  );
}
