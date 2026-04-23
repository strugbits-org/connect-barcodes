import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BrandsSection from "@/components/BrandsSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <BrandsSection />
        <CategoryGrid />
        <FeaturedProducts />
        <TrustBadges />

        {/* B2B Pricing Banner */}
        <section className="py-16 bg-brand-navy">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-4">
              <Tag size={14} /> B2B Pricing Available
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Save Up to 30% with Business Pricing
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Qualify for Tier 1, 2, or 3 pricing based on your purchase volume.
              Contact our B2B team to get your account set up today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-orange">
                Request B2B Quote <ArrowRight size={16} />
              </Link>
              <Link href="/products" className="btn-secondary">
                Browse Products
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { tier: "Standard", discount: "0%", desc: "All customers", color: "bg-gray-500/20 border-gray-500/30" },
                { tier: "Tier 1", discount: "5-10%", desc: "Qualified businesses", color: "bg-blue-500/20 border-blue-500/30" },
                { tier: "Tier 2", discount: "15-20%", desc: "Volume buyers", color: "bg-purple-500/20 border-purple-500/30" },
                { tier: "Tier 3", discount: "25-30%", desc: "Enterprise accounts", color: "bg-amber-500/20 border-amber-500/30" },
              ].map(({ tier, discount, desc, color }) => (
                <div key={tier} className={`border rounded-2xl p-5 text-center ${color} backdrop-blur-sm`}>
                  <div className="text-2xl font-bold text-white mb-1">{discount}</div>
                  <div className="text-white/90 font-semibold text-sm mb-1">{tier}</div>
                  <div className="text-white/50 text-xs">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
