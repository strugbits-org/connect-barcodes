"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function AddToCartButton({ variantId }: { variantId: string }) {
  const [qty, setQty] = useState(1);
  const { addItem, isLoading } = useCart();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 hover:bg-gray-50 transition-colors">
            <Minus size={16} />
          </button>
          <span className="w-12 text-center text-sm font-semibold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="px-3 py-3 hover:bg-gray-50 transition-colors">
            <Plus size={16} />
          </button>
        </div>
        <span className="text-sm text-gray-500">In stock</span>
      </div>

      <button
        onClick={() => addItem(variantId, qty)}
        disabled={isLoading}
        className="w-full btn-primary justify-center text-base py-3.5 disabled:opacity-60"
      >
        <ShoppingCart size={20} />
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
