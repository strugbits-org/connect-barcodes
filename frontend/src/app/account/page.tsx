"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, LogOut, Loader2, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { getCustomer, listOrders, loginCustomer, registerCustomer, logoutCustomer } from "@/lib/medusa";

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const c = await getCustomer();
    setCustomer(c);
    setOrders(c ? await listOrders() : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleLogout = async () => {
    await logoutCustomer();
    setCustomer(null);
    setOrders([]);
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-brand-navy mb-8">My Account</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading…
          </div>
        ) : !customer ? (
          <AuthCard onAuthed={load} />
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {(customer.first_name?.[0] ?? customer.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {customer.first_name || customer.last_name ? `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() : "Customer"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-secondary w-full justify-center text-sm">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </aside>

            {/* Orders */}
            <div className="flex-1">
              <h2 className="font-bold text-brand-navy mb-4 flex items-center gap-2"><Package size={18} /> Your Orders</h2>
              {orders.length === 0 ? (
                <div className="card p-8 text-center">
                  <Package size={48} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
                  <Link href="/products" className="btn-primary">Browse Products</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="card p-5">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{o.display_id ?? o.id.slice(-8)}</p>
                          <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">{o.fulfillment_status ?? o.status ?? "pending"}</span>
                          <span className="font-bold text-brand-navy">{formatPrice(o.total ?? 0)}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 border-t border-gray-50 pt-3">
                        {(o.items ?? []).slice(0, 4).map((it: any) => (
                          <div key={it.id} className="flex justify-between">
                            <span className="truncate pr-2">{(it.product_title ?? it.title)} × {it.quantity}</span>
                            <span className="flex-shrink-0">{formatPrice((it.unit_price ?? 0) * it.quantity)}</span>
                          </div>
                        ))}
                        {(o.items?.length ?? 0) > 4 && <p className="text-xs text-gray-400">+{o.items.length - 4} more</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ── Login / register card ────────────────────────────────────────────────────
function AuthCard({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "" });

  const change = (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await loginCustomer(form.email, form.password);
      } else {
        await registerCustomer(form);
      }
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      onAuthed();
    } catch (err: any) {
      toast.error(err?.message ?? (mode === "login" ? "Invalid email or password" : "Could not create account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="flex items-center gap-2 mb-6 text-brand-navy">
        <User size={20} />
        <div className="flex gap-4 text-sm font-semibold">
          <button onClick={() => setMode("login")} className={mode === "login" ? "text-brand-navy border-b-2 border-brand-navy pb-1" : "text-gray-400"}>Sign In</button>
          <button onClick={() => setMode("register")} className={mode === "register" ? "text-brand-navy border-b-2 border-brand-navy pb-1" : "text-gray-400"}>Create Account</button>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-3">
            <input name="first_name" value={form.first_name} onChange={change} placeholder="First name" required className="input-field" />
            <input name="last_name" value={form.last_name} onChange={change} placeholder="Last name" required className="input-field" />
          </div>
        )}
        <input name="email" type="email" value={form.email} onChange={change} placeholder="Email address" required className="input-field" />
        <div className="relative">
          <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={change} placeholder="Password" required minLength={6} className="input-field pr-10" />
          <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        {mode === "login" ? "New here? " : "Already have an account? "}
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-blue-600 font-medium">
          {mode === "login" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
