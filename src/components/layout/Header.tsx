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
            <NavigationMenuList className="gap-2">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="bg-transparent h-10 px-4 font-black uppercase tracking-widest text-[12px] hover:text-accent data-[state=open]:text-accent transition-colors">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white rounded-xl shadow-2xl">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/category/${item.slug}`}
                            className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-tr from-black to-gray-800 p-6 no-underline outline-none focus:shadow-md transition-all hover:scale-[1.02]"
                          >
                            <div className="mb-2 mt-4 text-xl font-black text-white uppercase tracking-tighter">
                              All {item.title}
                            </div>
                            <p className="text-sm leading-tight text-white/70 font-medium">
                              Explore our full premium collection of Professional {item.title}.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {item.subs.map((sub) => (
                        <li key={sub.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={sub.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-accent font-bold"
                            >
                              <div className="text-sm uppercase tracking-widest leading-none font-black">{sub.name}</div>
                              <p className="line-clamp-2 text-[10px] leading-snug text-muted-foreground uppercase tracking-tight">
                                {sub.desc}
                              </p>
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
                  <Link href="/deals" className={cn(navigationMenuTriggerStyle(), "bg-transparent h-10 px-4 font-black uppercase tracking-widest text-[12px] text-accent hover:text-accent/80 transition-colors")} passHref>
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white p-6 md:p-10 overflow-y-auto border-l border-border">
                <SheetHeader className="mb-10 text-left border-b pb-4">
                  <SheetTitle className="font-black uppercase tracking-tighter text-2xl flex items-center gap-2">
                    <Image src="/iRemax.png" alt="Logo" width={80} height={80} className="scale-110 object-contain" />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8">
                  {navItems.map((item) => (
                    <div key={item.title} className="flex flex-col gap-4">
                      <h4 className="font-black uppercase tracking-widest text-[11px] text-accent bg-accent/5 px-3 py-1.5 rounded-md inline-block w-fit">{item.title}</h4>
                      <div className="flex flex-col gap-3 pl-1">
                        <Link href={`/category/${item.slug}`} className="text-base font-bold uppercase tracking-tight hover:text-accent transition-colors">
                          All {item.title}
                        </Link>
                        {item.subs.map((sub) => (
                          <Link key={sub.name} href={sub.href} className="text-sm text-muted-foreground font-semibold hover:text-black transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-50 flex flex-col gap-0.5">
                            <span className="uppercase tracking-widest text-[10px] text-black/80">{sub.name}</span>
                            <span className="text-[9px] uppercase tracking-tighter opacity-70">{sub.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-border/50">
                    <Link href="/deals" className="flex items-center gap-2 font-black uppercase tracking-widest text-sm text-accent hover:bg-accent/5 p-3 rounded-lg transition-all">
                      Special Deals
                    </Link>
                    {session?.user?.role === "admin" && (
                      <Link href="/admin" className="flex items-center gap-2 font-black uppercase tracking-widest text-sm text-black hover:bg-black hover:text-white p-3 rounded-lg transition-all">
                        Admin Control Center
                      </Link>
                    )}
                  </div>
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
