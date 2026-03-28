import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from 'react-hot-toast';
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";


const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saymon Shop | Premium Electronics & Gear",
  description: "A conversion-optimized premium e-commerce platform for high-quality electronics and professional gear.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="font-body min-h-full flex flex-col pt-0">
        <Toaster position="top-right" />
        <NextAuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}



