"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ShieldCheck, Lock } from "lucide-react";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "",
    address: "", city: "", state: "", zip: "", country: "US",
  });
  const router = useRouter();
  const { cart } = useCart();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/account?order=success` },
      });
      if (error) {
        toast.error(error.message ?? "Payment failed");
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const Field = ({ name, label, type = "text", required = true }: { name: string; label: string; type?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        required={required}
        className="input-field"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-brand-navy mb-4">Contact Information</h2>
          <Field name="email" label="Email address" type="email" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-brand-navy mb-4">Shipping Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field name="firstName" label="First name" />
            <Field name="lastName" label="Last name" />
          </div>
          <div className="mt-4 space-y-4">
            <Field name="address" label="Street address" />
            <div className="grid grid-cols-3 gap-4">
              <Field name="city" label="City" />
              <Field name="state" label="State" />
              <Field name="zip" label="ZIP code" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-brand-navy mb-4">
            <span className="flex items-center gap-2"><Lock size={18} /> Payment</span>
          </h2>
          <div className="border border-gray-200 rounded-xl p-4">
            <PaymentElement />
          </div>
        </div>

        <button
          type="submit"
          disabled={!stripe || processing}
          className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60"
        >
          <ShieldCheck size={20} />
          {processing ? "Processing..." : `Pay ${formatPrice(cart?.total ?? 0)}`}
        </button>
      </div>

      {/* Order summary */}
      <div className="lg:order-first">
        <div className="card p-6 sticky top-24">
          <h2 className="font-bold text-lg text-brand-navy mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {(cart?.items ?? []).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.title} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatPrice(cart?.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span><span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-brand-navy text-base pt-2 border-t">
              <span>Total</span><span>{formatPrice(cart?.total ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const clientSecret = (cart?.payment_sessions?.[0]?.data as any)?.client_secret;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-navy mb-8">Checkout</h1>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        ) : (
          <div className="max-w-2xl">
            <div className="card p-8 text-center">
              <Lock size={48} className="text-gray-200 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Payment Session Required</h2>
              <p className="text-gray-400 text-sm">
                Please ensure your cart has items and a payment session is initialized.
                This happens automatically when Medusa backend is connected.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
