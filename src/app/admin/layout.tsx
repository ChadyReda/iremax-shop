"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Boxes,
  Layers,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Categories", icon: Boxes, href: "/admin/categories" },
  { name: "Collections", icon: Layers, href: "/admin/collections" },
  { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b px-4 h-16 flex items-center justify-between">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent
              items={sidebarItems}
              pathname={pathname}
              session={session}
              isCollapsed={false}
              onClose={() => setSidebarOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <h1 className="font-semibold">Admin Panel</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64"
        )}>
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 bg-white border rounded-full p-1 shadow-md hover:bg-gray-50 z-10"
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              collapsed && "rotate-180"
            )} />
          </button>

          <SidebarContent
            items={sidebarItems}
            pathname={pathname}
            session={session}
            isCollapsed={collapsed}
          />
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          collapsed ? "ml-20" : "ml-64"
        )}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden p-4">
        {children}
      </div>
    </div>
  );
}

// Separate Sidebar Content Component
function SidebarContent({
  items,
  pathname,
  session,
  isCollapsed,
  onClose
}: {
  items: any[],
  pathname: string,
  session: any,
  isCollapsed: boolean,
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className={cn(
        "h-16 border-b flex items-center",
        isCollapsed ? "justify-center" : "px-6"
      )}>
        <div className={cn(
          "bg-black text-white font-bold rounded-lg flex items-center justify-center",
          isCollapsed ? "w-8 h-8 text-lg" : "w-10 h-10 text-xl"
        )}>
          S
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-semibold text-lg">Admin Panel</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center mx-3 px-3 py-2 rounded-lg transition-colors",
                isCollapsed ? "justify-center" : "justify-start",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
              {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className={cn("flex items-center", isCollapsed ? "" : "space-x-3")}>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email || "admin@example.com"}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-3 w-full text-gray-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}