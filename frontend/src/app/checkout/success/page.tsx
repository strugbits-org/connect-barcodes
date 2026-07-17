"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/utils";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessInner />
    </Suspense>
  );
}

function CheckoutSuccessInner() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get("order");
  const [order, setOrder] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cb_last_order");
      if (raw) {
        const parsed = JSON.parse(raw);
        // Only use it if it matches the order in the URL (guards against stale)
        if (!orderIdFromUrl || parsed.id === orderIdFromUrl) setOrder(parsed);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, [orderIdFromUrl]);

  const orderNumber = order?.display_id ?? orderIdFromUrl?.replace("order_", "").slice(-8);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-brand-navy mb-2">Thank you for your order!</h1>
          <p className="text-gray-500">
            Your order has been placed successfully
            {order?.email ? <> — a confirmation will be sent to <strong>{order.email}</strong></> : null}.
          </p>
          {orderNumber && (
            <p className="mt-3 inline-block bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-full">
              Order #{orderNumber}
            </p>
          )}
        </div>

        {loaded && order ? (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-brand-navy mb-4 flex items-center gap-2">
              <Package size={18} /> Order Summary
            </h2>
            <div className="space-y-3 mb-4">
              {(order.items ?? []).map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{(item.product_title ?? item.title)} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice((item.unit_price ?? 0) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(order.subtotal ?? 0)}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">{(order.shipping_total ?? 0) > 0 ? formatPrice(order.shipping_total) : "Free"}</span>
              </div>
              <div className="flex justify-between font-bold text-brand-navy text-base pt-2 border-t">
                <span>Total</span><span>{formatPrice(order.total ?? 0)}</span>
              </div>
            </div>

            {order.shipping_address && (
              <div className="mt-5 pt-4 border-t border-gray-100 text-sm">
                <p className="font-semibold text-gray-900 mb-1">Shipping to</p>
                <p className="text-gray-600">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                  {order.shipping_address.address_1}<br />
                  {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                </p>
              </div>
            )}
          </div>
        ) : loaded ? (
          <div className="card p-6 mb-6 text-center text-gray-500 text-sm">
            Your order is confirmed. View full details in your account.
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="btn-primary justify-center">
            Continue Shopping <ArrowRight size={16} />
          </Link>
          <Link href="/account" className="btn-secondary justify-center">View My Orders</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
