"use client";

import { Suspense } from "react";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { User, Activity, AlertCircle, ShoppingBag } from "lucide-react";


function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      const session = await getSession();
      if (session?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    }
  };

  return (
    <Container className="flex items-center justify-center min-h-[80vh] py-12">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="space-y-4 pt-10 px-8">
          <div className="flex justify-center">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
              SAYMON<span className="text-accent">SHOP</span>
            </h1>
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-black uppercase tracking-tight italic">Welcome Back</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Enter your credentials to access your premium account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 space-y-6 pt-2">
          {searchParams.get("registered") && (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in zoom-in duration-300">
              Registration successful! Please login.
            </div>
          )}
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-border focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" id="password_label" className="text-[10px] font-black uppercase tracking-widest ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-border focus:ring-black"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-14 bg-black hover:bg-black/90 text-white rounded-xl font-black uppercase tracking-widest text-xs mt-6 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In Securely"}
            </Button>
          </form>

        </CardContent>
        <CardFooter className="pb-10 pt-4 flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Don&apos;t have an account? <Link href="/signup" className="text-accent hover:underline cursor-pointer">Register now</Link>
          </p>
        </CardFooter>

      </Card>
    </Container>
  );
}




export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}