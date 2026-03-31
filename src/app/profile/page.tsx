

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LogoutButton } from "./logoutButton";
import { CardFooter } from "@/components/ui/card";
export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }


  // Fetch full user data from Supabase
  const { data: userData } = await supabase
    .from('User')
    .select('*')
    .eq('id', (session?.user as any)?.id)
    .single();

  return (
    <Container className="py-12 md:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            MY<span className="text-accent underline decoration-4 underline-offset-8">PROFILE</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-black text-white text-center pb-12 pt-10">
              <div className="w-24 h-24 bg-accent/20 border-4 border-accent/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-accent" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight italic">{userData?.name || "Premium User"}</CardTitle>
              <CardDescription className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">
                {userData?.role || 'User'} ACCOUNT
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic mb-2">Member Since</p>
              <p className="text-sm font-black">{new Date(userData?.createdAt).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter>
              <LogoutButton />
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black uppercase tracking-tight italic">Account Details</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                Update your personal information below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</p>
                    <p className="font-bold">{userData?.name || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</p>
                    <p className="font-bold">{userData?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-black">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Role</p>
                    <p className="font-bold capitalize">{userData?.role}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {/* TODO: Add edit form here if needed, but for now just showing info as per step 1 */}
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                  Information management is currently restricted to viewing only.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
