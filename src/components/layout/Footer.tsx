import Link from "next/link";
import { Container } from "./Container";
import { Globe, Mail, CreditCard } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-12 pb-6 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold uppercase">iRemax</h2>
            </Link>
            <p className="text-sm text-gray-400">
              Professional photography gear and accessories. Expert support and fast delivery across Morocco.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent transition-colors">
                <Globe className="w-4 h-4" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-accent transition-colors">
                <Mail className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white">Digital Cameras</Link></li>
              <li><Link href="#" className="hover:text-white">Lenses</Link></li>
              <li><Link href="#" className="hover:text-white">Phone Cases</Link></li>
              <li><Link href="#" className="hover:text-white">Earphones</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase">Contact</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Monday - Friday: 9AM - 7PM</li>
              <li>Saturday: 10AM - 5PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10 text-xs text-gray-500">
          <p>&copy; {currentYear} iRemax. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}