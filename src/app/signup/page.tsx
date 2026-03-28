"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success - redirect to login
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
      setLoading(false);
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
            <CardTitle className="text-2xl font-black uppercase tracking-tight italic">Create Account</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Join us to experience premium shopping like never before
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 space-y-6 pt-2">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3 text-xs font-bold animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 rounded-xl border-border focus:ring-black"
              />
            </div>
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
              {loading ? "Creating Account..." : "Join the Community"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-10 pt-4 flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Already have an account? <Link href="/login" className="text-accent hover:underline cursor-pointer">Login here</Link>
          </p>
        </CardFooter>
      </Card>
    </Container>
  );
}
