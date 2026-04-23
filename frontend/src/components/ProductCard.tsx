"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Tag } from "lucide-react";
import { Product, CustomerTier } from "@/types";
import { formatPrice, TIER_LABELS } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

type Props = {
  product: Product;
  tier?: CustomerTier;
};

const TIER_COLORS: Record<CustomerTier, string> = {
  standard: "bg-gray-100 text-gray-700",
  tier1: "bg-blue-100 text-blue-700",
  tier2: "bg-purple-100 text-purple-700",
  tier3: "bg-amber-100 text-amber-700",
};

export default function ProductCard({ product, tier = "standard" }: Props) {
  const { addItem, isLoading } = useCart();
  const firstVariant = product.variants?.[0];
  const basePrice = firstVariant?.prices?.[0]?.amount ?? 0;
  const tierPrice = firstVariant?.tier_price ?? basePrice;
  const hasDiscount = tier !== "standard" && tierPrice < basePrice;
  const brand = product.metadata?.brand as string | undefined;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariant) return;
    await addItem(firstVariant.id, 1);
  };

  return (
    <Link href={`/product/${product.handle || product.id}`} className="group card flex flex-col hover:-translate-y-0.5 transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 rounded-t-xl overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <ShoppingCart size={48} />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            SALE
          </div>
        )}

        {tier !== "standard" && (
          <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${TIER_COLORS[tier]}`}>
            {tier.toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {brand && (
          <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{brand}</span>
        )}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 flex-1">{product.title}</h3>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={12} className={i <= 4 ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
          ))}
          <span className="text-xs text-gray-400 ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 line-through">{formatPrice(basePrice)}</span>
                <span className="text-lg font-bold text-green-600">{formatPrice(tierPrice)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-brand-navy">{formatPrice(tierPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant}
            className="bg-brand-navy hover:bg-brand-navy-light text-white p-2.5 rounded-lg transition-colors disabled:opacity-50"
            title="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
