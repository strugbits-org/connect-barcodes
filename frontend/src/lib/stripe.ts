import { loadStripe } from "@stripe/stripe-js";

let stripePromise: ReturnType<typeof loadStripe>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export async function createPaymentIntent(amount: number, currency: string = "usd") {
  const res = await fetch("/api/stripe/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency }),
  });
  return res.json();
}
