import { getProducts, getCategories, getCollections, deleteProduct } from "@/lib/actions/product";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { Trash2, Search, Filter, ArrowUpRight, Package, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  const collections = await getCollections();
  return <AdminProductsClient products={products} categories={categories} collections={collections} />;
}