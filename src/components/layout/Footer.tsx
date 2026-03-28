import Link from "next/link";
import { Container } from "./Container";
import {
  Globe,
  Mail,
  Share2,
  CreditCard,
  ShieldCheck,
  RotateCcw,
  Truck
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Logo & Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white">
                iRemax
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs transition-opacity hover:opacity-100">
              The premier destination for professional photographers, videographers, and creators. We provide world-class gear and unmatched support.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-white transition-all duration-300">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-white transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-accent hover:text-white transition-all duration-300">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Shop</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Digital Cameras</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Lenses & Optics</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Lighting Equipment</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Video & Pro Gear</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Refurbished</Link></li>
              </ul>
            </div>

            {/* Mini Map */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Our Location</h3>
              <div className="w-full aspect-[16/9] min-h-[300px] rounded overflow-hidden border border-white/20">
                <iframe
                  title="Store Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019029492209!2d-122.41941548468158!3d37.77492927975953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c2e62d3b1%3A0x2c7973a00bcd1f27!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1689800000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="border-0"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Work Timing */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Working Hours</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Monday - Friday: 9:00 AM - 7:00 PM</li>
              <li>Saturday: 10:00 AM - 5:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-white/5 mb-10">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $99" },
            { icon: RotateCcw, title: "30-Day Returns", desc: "Easy, hassle-free" },
            { icon: ShieldCheck, title: "Price Protection", desc: "Find a lower price? We'll match" },
            { icon: CreditCard, title: "Secure Checkout", desc: "Your security is our priority" }
          ].map((benefit, i) => (
            <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-2 group">
              <benefit.icon className="w-6 h-6 text-accent transition-transform group-hover:scale-110" />
              <div>
                <h4 className="font-bold text-sm tracking-tight">{benefit.title}</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Legal & Payments */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 text-[12px] text-gray-500 font-medium">
          <div className="flex flex-wrap justify-center gap-6">
            <p>&copy; {currentYear} iRemax Shop LLC. All rights reserved.</p>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}