"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  getCart,
  updateCart,
  listCartShippingOptions,
  addShippingMethod,
  initiatePaymentSession,
  completeCart,
  getCustomer,
} from "@/lib/medusa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ShieldCheck, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Info = {
  email: string; firstName: string; lastName: string;
  address: string; city: string; state: string; zip: string; country: string;
};

function extractClientSecret(pc: any): string | null {
  const sessions = pc?.payment_collection?.payment_sessions ?? [];
  const stripe = sessions.find((s: any) => s.provider_id === "pp_stripe_stripe") ?? sessions[sessions.length - 1];
  return stripe?.data?.client_secret ?? null;
}

// Module-scope so its identity is stable across InfoStep re-renders — a
// component defined inside the parent would remount on every keystroke and
// steal focus from the input.
function TextField({ name, label, type = "text", value, onChange, required = true, disabled = false }: {
  name: keyof Info; label: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange} required={required} disabled={disabled}
        className={`input-field ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

// ── Step 1: contact + shipping address ───────────────────────────────────────
function InfoStep({ onReady }: { onReady: (clientSecret: string) => void }) {
  const { cartId, refreshCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const [form, setForm] = useState<Info>({
    email: "", firstName: "", lastName: "",
    address: "", city: "", state: "", zip: "", country: "US",
  });

  // If the customer is logged in, prefill (and lock) their email + name.
  useEffect(() => {
    getCustomer().then((c: any) => {
      if (!c?.email) return;
      setEmailLocked(true);
      setForm((prev) => ({
        ...prev,
        email: c.email,
        firstName: prev.firstName || c.first_name || "",
        lastName: prev.lastName || c.last_name || "",
      }));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) { toast.error("No active cart"); return; }
    setSubmitting(true);
    try {
      const address = {
        first_name: form.firstName, last_name: form.lastName,
        address_1: form.address, city: form.city, province: form.state,
        postal_code: form.zip, country_code: form.country.toLowerCase(),
      };
      const updated = await updateCart(cartId, {
        email: form.email, shipping_address: address, billing_address: address,
      });
      if (!updated) throw new Error("Could not save your details");

      const options = await listCartShippingOptions(cartId);
      if (!options.length) throw new Error("No shipping options available for this address");
      const added = await addShippingMethod(cartId, options[0].id);
      if (!added) throw new Error("Could not set shipping method");

      await refreshCart();
      const fresh = await getCart(cartId);
      const pc = await initiatePaymentSession(fresh?.cart);
      const secret = extractClientSecret(pc);
      if (!secret) throw new Error("Could not start payment. Please try again.");

      onReady(secret);
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Contact Information</h2>
        <TextField name="email" label="Email address" type="email" value={form.email} onChange={handleChange} disabled={emailLocked} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Shipping Address</h2>
        <div className="grid grid-cols-2 gap-4">
          <TextField name="firstName" label="First name" value={form.firstName} onChange={handleChange} />
          <TextField name="lastName" label="Last name" value={form.lastName} onChange={handleChange} />
        </div>
        <div className="mt-4 space-y-4">
          <TextField name="address" label="Street address" value={form.address} onChange={handleChange} />
          <div className="grid grid-cols-3 gap-4">
            <TextField name="city" label="City" value={form.city} onChange={handleChange} />
            <TextField name="state" label="State" value={form.state} onChange={handleChange} />
            <TextField name="zip" label="ZIP code" value={form.zip} onChange={handleChange} />
          </div>
        </div>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60">
        {submitting ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
        {submitting ? "Preparing payment…" : "Continue to payment"}
      </button>
    </form>
  );
}

// ── Step 2: Stripe payment ───────────────────────────────────────────────────
function PaymentStep() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, cartId, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !cartId) return;
    setProcessing(true);
    try {
      const { error } = await stripe.confirmPayment({ elements, redirect: "if_required" });
      if (error) { toast.error(error.message ?? "Payment failed"); return; }

      const res: any = await completeCart(cartId);
      if (res?.type === "order" && res.order) {
        try { sessionStorage.setItem("cb_last_order", JSON.stringify(res.order)); } catch { /* ignore */ }
        clearCart();
        toast.success("Order placed!");
        router.push(`/checkout/success?order=${res.order.id}`);
      } else {
        toast.error(res?.error?.message ?? "Payment went through but the order could not be finalized. Please contact support.");
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">
          <span className="flex items-center gap-2"><Lock size={18} /> Payment</span>
        </h2>
        <div className="border border-gray-200 rounded-xl p-4"><PaymentElement /></div>
      </div>
      <button type="submit" disabled={!stripe || processing} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60">
        {processing ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
        {processing ? "Processing…" : `Pay ${formatPrice(cart?.total ?? 0)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const hasItems = (cart?.items?.length ?? 0) > 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-navy mb-8">Checkout</h1>

        {!hasItems ? (
          <div className="card p-8 text-center max-w-2xl">
            <Lock size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <Link href="/products" className="btn-primary mt-2">Browse Products</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentStep />
                </Elements>
              ) : (
                <InfoStep onReady={setClientSecret} />
              )}
            </div>

            {/* Order summary */}
            <div className="lg:order-first">
              <div className="card p-6 sticky top-24">
                <h2 className="font-bold text-lg text-brand-navy mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {(cart?.items ?? []).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.product_title ?? item.title} × {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>{formatPrice(cart?.subtotal ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span><span className="text-green-600">{(cart?.shipping_total ?? 0) > 0 ? formatPrice(cart!.shipping_total!) : "Free"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-navy text-base pt-2 border-t">
                    <span>Total</span><span>{formatPrice(cart?.total ?? 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
