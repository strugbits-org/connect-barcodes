"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Search, Phone, Mail, ChevronDown, Menu, X, User,
  Tag, Package, Printer, Smartphone, Monitor, Settings, Layers
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "Barcode Scanners", handle: "barcode-scanners", icon: Search },
  { name: "Label Printers", handle: "label-printers", icon: Printer },
  { name: "Receipt Printers", handle: "receipt-printers", icon: Layers },
  { name: "Mobile Computers", handle: "mobile-computers", icon: Smartphone },
  { name: "POS Systems", handle: "pos-systems", icon: Monitor },
  { name: "Supplies & Media", handle: "supplies-media", icon: Tag },
  { name: "Accessories", handle: "accessories", icon: Settings },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-brand-navy-dark text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:1-800-BARCODE" className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
              <Phone size={12} /> 1-800-BARCODE
            </a>
            <a href="mailto:sales@connectbarcodes.com" className="flex items-center gap-1.5 hover:text-blue-300 transition-colors hidden sm:flex">
              <Mail size={12} /> sales@connectbarcodes.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/account" className="hover:text-blue-300 transition-colors">My Account</Link>
            <Link href="/quote" className="hover:text-blue-300 transition-colors">Request Quote</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={cn("bg-brand-navy transition-shadow", scrolled && "shadow-lg shadow-black/20")}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-lg leading-tight">ConnectBarcodes</div>
                <div className="text-blue-300 text-xs">POS & Barcode Experts</div>
              </div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for scanners, printers, POS systems..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2.5 pr-12 text-sm focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all duration-200"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/account" className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
              <User size={18} />
              <span className="hidden lg:block">Account</span>
            </Link>
            <Link href="/cart" className="relative flex items-center gap-1.5 text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-fade-in">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Category navigation */}
        <div className="border-t border-white/10 hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {CATEGORIES.map(({ name, handle, icon: Icon }) => (
                <Link
                  key={handle}
                  href={`/products?category=${handle}`}
                  className="flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded transition-all text-sm whitespace-nowrap flex-shrink-0"
                >
                  <Icon size={14} />
                  {name}
                </Link>
              ))}
              <Link href="/products" className="flex items-center gap-1.5 text-brand-orange hover:text-orange-400 ml-auto px-3 py-2.5 text-sm font-medium whitespace-nowrap flex-shrink-0">
                View All Products →
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-navy-dark border-t border-white/10 animate-fade-in">
          <div className="p-4 space-y-1">
            {CATEGORIES.map(({ name, handle, icon: Icon }) => (
              <Link
                key={handle}
                href={`/products?category=${handle}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition-all"
              >
                <Icon size={16} />
                {name}
              </Link>
            ))}
            <hr className="border-white/10 my-2" />
            <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-white/80 hover:text-white px-3 py-2.5">
              <User size={16} /> My Account
            </Link>
            <Link href="/quote" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-white/80 hover:text-white px-3 py-2.5">
              <Tag size={16} /> Request Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
