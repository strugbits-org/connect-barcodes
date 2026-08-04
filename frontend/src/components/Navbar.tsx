"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart, Phone, Mail, Menu, X, User, Tag, Package, ChevronDown
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { getCategories } from "@/lib/medusa";
import SearchBox from "@/components/SearchBox";

type NavCategory = { name: string; handle: string };

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const { itemCount } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Load real categories so nav links match the backend (handles were hardcoded).
  useEffect(() => {
    getCategories().then((d: any) =>
      setCategories(((d?.product_categories ?? []) as any[]).map((c) => ({ name: c.name, handle: c.handle })))
    );
  }, []);


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
          <SearchBox variant="navbar" />

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
            <CategoryNav categories={categories} />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-navy-dark border-t border-white/10 animate-fade-in">
          <div className="p-4 space-y-1">
            {categories.map(({ name, handle }) => (
              <Link
                key={handle}
                href={`/products?category=${handle}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded-lg transition-all"
              >
                <Tag size={16} />
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

const ITEM_CLASS =
  "flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10 px-3 py-2.5 rounded transition-all text-sm whitespace-nowrap flex-shrink-0";

// Priority+ category nav: shows the categories that fit and collapses the rest
// into a "More" dropdown; recalculates on container resize.
function CategoryNav({ categories }: { categories: NavCategory[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [moreOpen, setMoreOpen] = useState(false);

  // Measure how many items fit; reserve room for the "More" button + "View All".
  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;
    const RESERVE = 250; // px for "More ▾" + "View All Products →"
    const GAP = 4;
    const compute = () => {
      const items = Array.from(measure.children) as HTMLElement[];
      const available = container.clientWidth - RESERVE;
      let used = 0;
      let count = 0;
      for (const item of items) {
        used += item.offsetWidth + GAP;
        if (used > available) break;
        count++;
      }
      setVisibleCount(count);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [categories]);

  // Close the dropdown on outside click.
  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [moreOpen]);

  const visible = categories.slice(0, visibleCount);
  const overflow = categories.slice(visibleCount);

  return (
    <div ref={containerRef} className="flex items-center gap-1 relative">
      {/* Hidden full-width row used only to measure natural item widths */}
      <div ref={measureRef} aria-hidden className="absolute -left-[9999px] top-0 flex items-center gap-1 pointer-events-none invisible">
        {categories.map((c) => (
          <span key={c.handle} className={ITEM_CLASS}><Tag size={14} />{c.name}</span>
        ))}
      </div>

      {visible.map(({ name, handle }) => (
        <Link key={handle} href={`/products?category=${handle}`} className={ITEM_CLASS}>
          <Tag size={14} />
          {name}
        </Link>
      ))}

      {overflow.length > 0 && (
        <div ref={moreRef} className="relative flex-shrink-0">
          <button type="button" onClick={() => setMoreOpen((v) => !v)} className={ITEM_CLASS} aria-expanded={moreOpen}>
            More <ChevronDown size={14} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
          </button>
          {moreOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl py-1 min-w-[210px] z-50">
              {overflow.map(({ name, handle }) => (
                <Link
                  key={handle}
                  href={`/products?category=${handle}`}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap"
                >
                  <Tag size={14} className="text-gray-400" />
                  {name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <Link href="/products" className="flex items-center gap-1.5 text-brand-orange hover:text-orange-400 ml-auto px-3 py-2.5 text-sm font-medium whitespace-nowrap flex-shrink-0">
        View All Products →
      </Link>
    </div>
  );
}
