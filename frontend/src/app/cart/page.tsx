"use client";

import { useCart } from "@/context/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cart, isLoading, itemCount, updateItem, removeItem } = useCart();
  const items = cart?.items ?? [];

  if (itemCount === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <ShoppingBag size={80} className="text-gray-200 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add products to get started</p>
          <Link href="/products" className="btn-primary">Browse Products <ArrowRight size={16} /></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
  const shipping = subtotal >= 20000 ? 0 : 1500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-navy mb-6">Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex items-start gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  {item.variant?.product?.thumbnail ? (
                    <Image src={item.variant.product.thumbnail} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={24} className="text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">
                    {item.variant?.product?.title ?? item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{item.variant?.title}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateItem(item.id, Math.max(0, item.quantity - 1))}
                        disabled={isLoading}
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand-navy">{formatPrice(item.unit_price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.id)} disabled={isLoading} className="text-red-400 hover:text-red-600 transition-colors p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-lg text-brand-navy mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">Free shipping on orders over $200</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-brand-navy text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full justify-center text-base py-3.5 mb-3">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link href="/products" className="btn-secondary w-full justify-center">
                Continue Shopping
              </Link>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-700 text-center">
                  🔒 Secure checkout with Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
