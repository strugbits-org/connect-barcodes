import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "./AddToCartButton";
import { getProductByHandle, getProduct } from "@/lib/medusa";
import { formatPrice } from "@/lib/utils";
import { Package, Shield, Truck, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProductByHandle(params.id) || await getProduct(params.id);
    if (!product) return { title: "Product Not Found" };
    return {
      title: (product as any).title,
      description: (product as any).description ?? undefined,
      openGraph: { images: (product as any).thumbnail ? [(product as any).thumbnail] : [] },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  let product: any = null;

  try {
    product = await getProductByHandle(params.id) || await getProduct(params.id);
  } catch {
    notFound();
  }

  if (!product) notFound();

  const firstVariant = product.variants?.[0];
  const basePrice = firstVariant?.prices?.[0]?.amount ?? 0;
  const brand = product.metadata?.brand as string | undefined;
  const sku = product.metadata?.sku as string | undefined;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-gray-600">Products</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">{product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {product.thumbnail ? (
              <Image src={product.thumbnail} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={80} className="text-gray-200" />
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {brand && <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">{brand}</span>}
            <h1 className="text-3xl font-bold text-brand-navy mt-1 mb-3">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} className={i <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">4.0 (24 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-brand-navy">{formatPrice(basePrice)}</div>
              {sku && <div className="text-sm text-gray-400 mt-1">SKU: {sku}</div>}
            </div>

            {/* B2B pricing table */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">B2B Volume Pricing</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { tier: "Standard", price: basePrice, label: "List price" },
                  { tier: "Tier 1", price: Math.round(basePrice * 0.925), label: "5-10% off" },
                  { tier: "Tier 2", price: Math.round(basePrice * 0.825), label: "15-20% off" },
                  { tier: "Tier 3", price: Math.round(basePrice * 0.725), label: "25-30% off" },
                ].map(({ tier, price, label }) => (
                  <div key={tier} className="bg-white rounded-lg p-2.5 text-center">
                    <div className="text-xs text-gray-500 mb-0.5">{tier}</div>
                    <div className="font-bold text-sm text-brand-navy">{formatPrice(price)}</div>
                    <div className="text-xs text-green-600">{label}</div>
                  </div>
                ))}
              </div>
              <Link href="/quote" className="block text-center text-xs text-blue-600 hover:text-blue-700 mt-3 font-medium">
                Request a custom quote →
              </Link>
            </div>

            {/* Add to cart */}
            {firstVariant && <AddToCartButton variantId={firstVariant.id} />}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Shield, text: "2-Year Warranty" },
                { icon: Truck, text: "Free Ship $200+" },
                { icon: Package, text: "Easy Returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <Icon size={20} className="text-blue-600 mb-1" />
                  <span className="text-xs text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold text-brand-navy mb-4">Product Description</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
