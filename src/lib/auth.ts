import { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { supabase } from "@/lib/supabase";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {

  // Removing PrismaAdapter to replace with Supabase implementation
  // For a full Supabase integration, you'd typically use @supabase/ssr or a Supabase adapter.
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Lookup user in Supabase
        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (user) {
          // Dev logic: allow admin123 for existing admins, 
          // otherwise check the password stored in our table
          if (user.role === 'admin' && credentials.password === 'admin123') {
            return user;
          }
          if (user.password === credentials.password) {
            return user;
          }
        }


        
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
  },
};

