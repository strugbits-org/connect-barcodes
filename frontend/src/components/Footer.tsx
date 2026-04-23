import Link from "next/link";
import { Package, Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
                <Package size={18} />
              </div>
              <span className="font-bold text-lg">ConnectBarcodes</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Your trusted source for professional barcode scanners, label printers, and POS systems.
              Serving businesses nationwide since 2010.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Products</h4>
            <ul className="space-y-2.5">
              {[
                ["Barcode Scanners", "/products?category=barcode-scanners"],
                ["Label Printers", "/products?category=label-printers"],
                ["Receipt Printers", "/products?category=receipt-printers"],
                ["Mobile Computers", "/products?category=mobile-computers"],
                ["POS Systems", "/products?category=pos-systems"],
                ["Supplies & Media", "/products?category=supplies-media"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/60 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Company</h4>
            <ul className="space-y-2.5">
              {[
                ["About Us", "/about"],
                ["Request a Quote", "/quote"],
                ["B2B Pricing", "/b2b-pricing"],
                ["My Account", "/account"],
                ["Order Status", "/account"],
                ["Contact Us", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-white/60 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-blue-400" />
                <span>1-800-BARCODE (1-800-227-2633)</span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-blue-400" />
                <a href="mailto:sales@connectbarcodes.com" className="hover:text-white transition-colors">sales@connectbarcodes.com</a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-blue-400" />
                <span>123 Commerce Drive<br />Atlanta, GA 30301</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xs text-white/60 mb-2">Business Hours</p>
              <p className="text-sm text-white/80">Mon-Fri: 8am – 6pm ET</p>
              <p className="text-sm text-white/80">Sat: 9am – 1pm ET</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} ConnectBarcodes. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((link) => (
              <Link key={link} href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">{link}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
