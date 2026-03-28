"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  Settings,
  ShoppingCart,
  Users,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Boxes,
  Layers,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "next-auth/react";



const sidebarItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Categories", icon: Boxes, href: "/admin/categories" },
  { name: "Collections", icon: Layers, href: "/admin/collections" },
  { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
];

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const SidebarContent = () => (
    <>
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black text-xl italic text-white shadow-xl shadow-accent/20">S</div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter leading-none italic">Admin Panel</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-accent mt-0.5">Control Center v1.0</p>
          </div>
        </div>

        <nav className="flex-grow space-y-1.5">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group",
                  isActive
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}>
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5 transition-transform", !isActive && "group-hover:scale-110")} />
                    <span className="text-sm font-bold uppercase tracking-widest">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <Separator className="bg-white/10" />
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gray-600 overflow-hidden" />
            <div className="flex-grow">
              <p className="text-xs font-black uppercase tracking-widest truncate leading-tight">Admin User</p>
              <p className="text-[10px] text-white/50 font-medium truncate">reda@saymonshop.com</p>
            </div>
            <button className="text-white/40 hover:text-accent transition-colors" onClick={() => {
              signOut({ callbackUrl: "/" });
            }}>
              <LogOut className="w-4 h-4" />
            </button>

          </div>
          <p className="text-[8px] uppercase font-black tracking-widest text-center text-white/20">
            Saymon Shop Pro Management
          </p>
        </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-black text-white hidden lg:flex flex-col p-6 z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:pl-72 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-20 bg-white border-b border-border/50 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between lg:justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-black hover:bg-gray-100">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-6 bg-black text-white border-r-gray-800 flex flex-col h-full">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4">
            <Button className="h-10 bg-black hover:bg-black/90 text-white rounded-lg font-black uppercase text-[10px] tracking-widest px-6" onClick={() => {
              signOut({ callbackUrl: "/" });
            }}>
              Logout
            </Button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-10 overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
