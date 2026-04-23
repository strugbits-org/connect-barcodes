import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/medusa";
import { Product } from "@/types";

// Static fallback products for SSG/ISR when Medusa is not yet running
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "zebra-zt411",
    title: "Zebra ZT411 Industrial Printer",
    description: "High-performance industrial label printer",
    handle: "zebra-zt411-industrial-printer",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1612198273689-b22fa91e1f21?w=400",
    metadata: { brand: "Zebra" },
    variants: [{ id: "v1", title: "Default", prices: [{ id: "p1", amount: 89900, currency_code: "usd" }] }],
  },
  {
    id: "honeywell-xenon",
    title: "Honeywell Xenon 1950 Scanner",
    description: "Area-imaging scanner",
    handle: "honeywell-xenon-1950",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    metadata: { brand: "Honeywell" },
    variants: [{ id: "v2", title: "USB", prices: [{ id: "p2", amount: 29900, currency_code: "usd" }] }],
  },
  {
    id: "epson-tm-t88",
    title: "Epson TM-T88VI Receipt Printer",
    description: "High-speed thermal receipt printer",
    handle: "epson-tm-t88vi-receipt-printer",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    metadata: { brand: "Epson" },
    variants: [{ id: "v3", title: "USB+Ethernet", prices: [{ id: "p3", amount: 49900, currency_code: "usd" }] }],
  },
  {
    id: "datalogic-quickscan",
    title: "Datalogic QuickScan QD2430",
    description: "Omnidirectional 2D imager",
    handle: "datalogic-quickscan-qd2430",
    status: "published",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    metadata: { brand: "Datalogic" },
    variants: [{ id: "v4", title: "Black USB", prices: [{ id: "p4", amount: 22900, currency_code: "usd" }] }],
  },
];

export default async function FeaturedProducts() {
  let products: Product[] = [];

  try {
    const data = await getProducts({ limit: 8 });
    products = (data?.products as Product[]) ?? [];
  } catch {
    // Use fallback for build time
    products = FALLBACK_PRODUCTS;
  }

  const displayProducts = products.length > 0 ? products : FALLBACK_PRODUCTS;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-brand-navy mb-2">Featured Products</h2>
            <p className="text-gray-500">Top-selling barcode and POS equipment</p>
          </div>
          <Link href="/products" className="btn-primary hidden sm:inline-flex">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/products" className="btn-primary">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
