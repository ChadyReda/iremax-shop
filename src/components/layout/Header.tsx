"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Container } from "./Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "./CartDrawer";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  LogOut,
  LayoutDashboard,
  UserCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

export function Header() {
  const router = useRouter();
  const { data: session } = useSession() as { data: any };
  const [isScrolled, setIsScrolled] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      title: "PhoneCases",
      slug: "phone-cases",
      subs: [
        { name: "iPhone", desc: "Highest resolution for pros", href: "/category/phone-cases?search=iphone" },
        { name: "Samsung", desc: "Reliable workhorses", href: "/category/phone-cases?search=samsung" },
        { name: "Xiaomi", desc: "Hollywood grade video", href: "/category/phone-cases?search=xiaomi" }
      ]
    },
    {
      title: "Earphones",
      slug: "earphones",
      subs: [
        { name: "Airpods", desc: "Superior sharpness", href: "/category/earphones?search=airpods" },
        { name: "Samsung", desc: "Versatile setups", href: "/category/earphones?search=samsung" },
        { name: "Xiaomi", desc: "Precise focal control", href: "/category/earphones?search=xiaomi" }
      ]
    }
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md border-b py-2 shadow-sm" : "bg-white py-4"
      )}
    >
      <Container>
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              <Image src="/iRemax.png" alt="Logo" width={100} height={100} className="scale-[1.2]" />
            </h1>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="bg-transparent h-9 px-3 font-bold uppercase text-xs">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[350px] gap-2 p-4 bg-white rounded-xl shadow-lg">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${item.slug}`}
                            className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="text-sm font-bold uppercase">All {item.title}</div>
                            <p className="text-xs text-muted-foreground">Explore full collection</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {item.subs.map((sub) => (
                        <li key={sub.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={sub.href}
                              className="block p-2 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              <div className="text-xs font-bold uppercase">{sub.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/deals" className={cn(navigationMenuTriggerStyle(), "bg-transparent h-9 px-3 font-bold uppercase text-xs text-accent")} passHref>
                    Deals
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="hidden md:flex flex-grow max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search premium gear..."
              className="pl-10 h-11 border-border focus-visible:ring-black rounded-lg"
            />
          </div>

          {/* User Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {session && session.user?.role === "admin" && (
              <>
                <Link href="/admin">
                  <Button variant="ghost" size="icon" title="Admin Dashboard" className="hidden sm:inline-flex hover:bg-muted text-accent">
                    <LayoutDashboard className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                  }}
                  className="hidden sm:inline-flex hover:bg-muted text-destructive"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            )}
            <Link href="/wishlist">

              <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-muted group">
                <Heart className="w-5 h-5 group-hover:fill-accent group-hover:text-accent" />
              </Button>
            </Link>
            <CartDrawer>

              <Button variant="ghost" size="icon" className="hover:bg-muted relative">
                <ShoppingCart className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-accent text-white border-none animate-in zoom-in duration-300">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </CartDrawer>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-muted">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white p-6 overflow-y-auto border-l">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-black uppercase text-xl">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <div key={item.title} className="border-b pb-4">
                      <Link href={`/category/${item.slug}`} className="font-bold uppercase text-sm hover:text-accent transition-colors">
                        {item.title}
                      </Link>
                      <div className="mt-2 pl-2 flex flex-col gap-2">
                        {item.subs.map((sub) => (
                          <Link key={sub.name} href={sub.href} className="text-xs text-muted-foreground hover:text-black transition-colors">
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Link href="/deals" className="font-bold uppercase text-sm text-accent">
                    Special Deals
                  </Link>
                  {session?.user?.role === "admin" && (
                    <Link href="/admin" className="font-bold uppercase text-sm">
                      Admin
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search gear..."
            className="pl-10 h-11 border-border focus-visible:ring-black rounded-lg"
          />
        </div>
      </Container>
    </header>
  );
}
