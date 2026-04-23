"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Headphones, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-brand-navy overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px"
        }} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/95 to-brand-navy-light/80" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6">
              <Star size={14} className="fill-current" />
              <span>Trusted by 10,000+ businesses nationwide</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Professional Barcode &{" "}
              <span className="text-brand-orange">POS Solutions</span>{" "}
              for Business
            </h1>

            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Shop top brands like Zebra, Honeywell, Datalogic, and Epson.
              B2B pricing tiers available — up to 30% off for qualifying businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link href="/products" className="btn-orange text-base">
                Shop All Products <ArrowRight size={18} />
              </Link>
              <Link href="/quote" className="btn-secondary text-base">
                Request B2B Quote
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Truck, text: "Free shipping over $200" },
                { icon: ShieldCheck, text: "2-year warranty" },
                { icon: Headphones, text: "Expert support" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/60 text-sm">
                  <Icon size={16} className="text-blue-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats / Visual */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { value: "500+", label: "Products", color: "bg-blue-500/20 border-blue-500/30" },
              { value: "15k+", label: "Orders Shipped", color: "bg-orange-500/20 border-orange-500/30" },
              { value: "4.9★", label: "Avg Rating", color: "bg-green-500/20 border-green-500/30" },
              { value: "24/7", label: "Support", color: "bg-purple-500/20 border-purple-500/30" },
            ].map(({ value, label, color }) => (
              <div key={label} className={`border rounded-2xl p-6 text-center ${color} backdrop-blur-sm`}>
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full fill-gray-50">
          <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" />
        </svg>
      </div>
    </section>
  );
}
