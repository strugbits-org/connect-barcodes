"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, LogOut, Loader2, User, Eye, EyeOff, FileText, Clock, CheckCircle, XCircle, ChevronDown, MapPin, Phone, Building2, MessageSquare, Mail } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import { getCustomer, listOrders, loginCustomer, registerCustomer, logoutCustomer, getQuotes } from "@/lib/medusa";

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "quotes">("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const c = await getCustomer();
    setCustomer(c);
    if (c) {
      const [o, q] = await Promise.all([listOrders(), getQuotes(c.email)]);
      setOrders(o);
      setQuotes(q.quotes ?? []);
    } else {
      setOrders([]);
      setQuotes([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleLogout = async () => {
    await logoutCustomer();
    setCustomer(null);
    setOrders([]);
    setQuotes([]);
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

            {/* Tabs + Content */}
            <div className="flex-1">
              <div className="flex gap-1 mb-6 border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "orders" ? "border-brand-navy text-brand-navy" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                  <Package size={16} /> Orders {orders.length > 0 && <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{orders.length}</span>}
                </button>
                <button
                  onClick={() => setActiveTab("quotes")}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "quotes" ? "border-brand-navy text-brand-navy" : "border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                  <FileText size={16} /> Quotes {quotes.length > 0 && <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{quotes.length}</span>}
                </button>
              </div>

              {activeTab === "orders" && (
                <>
                  {orders.length === 0 ? (
                    <div className="card p-8 text-center">
                      <Package size={48} className="text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
                      <Link href="/products" className="btn-primary">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((o) => {
                        const isOpen = expandedOrder === o.id;
                        const shipping = o.shipping_address;
                        return (
                          <div key={o.id} className="card overflow-hidden">
                            <button
                              onClick={() => setExpandedOrder(isOpen ? null : o.id)}
                              className="w-full p-5 text-left hover:bg-gray-50/50 transition-colors"
                            >
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                  <div>
                                    <p className="font-semibold text-gray-900">Order #{o.display_id ?? o.id.slice(-8)}</p>
                                    <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">{o.fulfillment_status ?? o.status ?? "pending"}</span>
                                  <span className="font-bold text-brand-navy">{formatPrice(o.total ?? 0)}</span>
                                </div>
                              </div>
                            </button>

                            {isOpen && (() => {
                              const billing = o.billing_address;
                              return (
                              <div className="px-5 pb-5 border-t border-gray-100">
                                <div className="mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {o.email && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Mail size={12} /> Contact</p>
                                      <p className="text-sm text-gray-700">{o.email}</p>
                                    </div>
                                  )}

                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment</p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${(o.payment_status === "captured" || o.payment_status === "paid") ? "bg-green-50 text-green-700" : o.payment_status === "refunded" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
                                      {o.payment_status ?? "pending"}
                                    </span>
                                  </div>

                                  {shipping && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><MapPin size={12} /> Shipping Address</p>
                                      <p className="text-sm text-gray-700">
                                        {[shipping.first_name, shipping.last_name].filter(Boolean).join(" ")}<br />
                                        {shipping.address_1}{shipping.address_2 ? `, ${shipping.address_2}` : ""}<br />
                                        {[shipping.city, shipping.province, shipping.postal_code].filter(Boolean).join(", ")}<br />
                                        {shipping.country_code?.toUpperCase()}
                                      </p>
                                      {shipping.phone && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Phone size={10} /> {shipping.phone}</p>}
                                    </div>
                                  )}

                                  {billing && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Building2 size={12} /> Billing Address</p>
                                      <p className="text-sm text-gray-700">
                                        {[billing.first_name, billing.last_name].filter(Boolean).join(" ")}<br />
                                        {billing.address_1}{billing.address_2 ? `, ${billing.address_2}` : ""}<br />
                                        {[billing.city, billing.province, billing.postal_code].filter(Boolean).join(", ")}<br />
                                        {billing.country_code?.toUpperCase()}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items ({(o.items ?? []).length})</p>
                                <div className="space-y-2">
                                  {(o.items ?? []).map((it: any) => {
                                    const productLink = it.product_handle ? `/product/${it.product_handle}` : it.product_id ? `/product/${it.product_id}` : null;
                                    return (
                                    <div key={it.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                                      {productLink ? (
                                        <Link href={productLink} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-white block hover:ring-2 hover:ring-brand-navy/20 transition-all">
                                          {it.thumbnail ? (
                                            <img src={it.thumbnail} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <span className="w-full h-full flex items-center justify-center"><Package size={16} className="text-gray-300" /></span>
                                          )}
                                        </Link>
                                      ) : (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-white flex items-center justify-center">
                                          {it.thumbnail ? (
                                            <img src={it.thumbnail} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <Package size={16} className="text-gray-300" />
                                          )}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        {productLink ? (
                                          <Link href={productLink} className="text-sm font-medium text-gray-800 truncate block hover:text-brand-navy transition-colors">{it.product_title ?? it.title}</Link>
                                        ) : (
                                          <p className="text-sm font-medium text-gray-800 truncate">{it.product_title ?? it.title}</p>
                                        )}
                                        {it.variant_title && it.variant_title !== "Default" && <p className="text-xs text-gray-400">{it.variant_title}</p>}
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-semibold text-gray-800">{formatPrice((it.unit_price ?? 0) * it.quantity)}</p>
                                        <p className="text-xs text-gray-400">× {it.quantity}</p>
                                      </div>
                                    </div>
                                    );
                                  })}
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-sm">
                                  {o.subtotal != null && (
                                    <div className="flex justify-between text-gray-500">
                                      <span>Subtotal</span><span>{formatPrice(o.subtotal)}</span>
                                    </div>
                                  )}
                                  {(o.shipping_total ?? 0) > 0 && (
                                    <div className="flex justify-between text-gray-500">
                                      <span>Shipping</span><span>{formatPrice(o.shipping_total)}</span>
                                    </div>
                                  )}
                                  {(o.tax_total ?? 0) > 0 && (
                                    <div className="flex justify-between text-gray-500">
                                      <span>Tax</span><span>{formatPrice(o.tax_total)}</span>
                                    </div>
                                  )}
                                  {(o.discount_total ?? 0) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Discount</span><span>-{formatPrice(o.discount_total)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-bold text-brand-navy pt-1">
                                    <span>Total</span><span>{formatPrice(o.total ?? 0)}</span>
                                  </div>
                                </div>
                              </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {activeTab === "quotes" && (
                <>
                  {quotes.length === 0 ? (
                    <div className="card p-8 text-center">
                      <FileText size={48} className="text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">You haven&apos;t submitted any quote requests yet.</p>
                      <Link href="/quote" className="btn-primary">Request a Quote</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quotes.map((q) => {
                        const statusStyle: Record<string, string> = {
                          pending: "bg-yellow-50 text-yellow-700",
                          reviewed: "bg-blue-50 text-blue-700",
                          approved: "bg-green-50 text-green-700",
                          rejected: "bg-red-50 text-red-700",
                        };
                        const StatusIcon = q.status === "approved" ? CheckCircle : q.status === "rejected" ? XCircle : Clock;
                        const items = Array.isArray(q.items) ? q.items : [];
                        const isOpen = expandedQuote === q.id;
                        return (
                          <div key={q.id} className="card overflow-hidden">
                            <button
                              onClick={() => setExpandedQuote(isOpen ? null : q.id)}
                              className="w-full p-5 text-left hover:bg-gray-50/50 transition-colors"
                            >
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                  <div>
                                    <p className="font-semibold text-gray-900">Quote Request</p>
                                    <p className="text-xs text-gray-400">{new Date(q.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex items-center gap-1 ${statusStyle[q.status] ?? "bg-gray-100 text-gray-600"}`}>
                                    <StatusIcon size={12} /> {q.status}
                                  </span>
                                  <span className="text-sm text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
                                </div>
                              </div>
                            </button>

                            {isOpen && (
                              <div className="px-5 pb-5 border-t border-gray-100">
                                <div className="mt-4 mb-4 grid grid-cols-2 gap-3">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><User size={12} /> Contact</p>
                                    <p className="text-sm font-medium text-gray-800">{q.customer_name}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={10} /> {q.customer_email}</p>
                                    {q.phone && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> {q.phone}</p>}
                                  </div>
                                  {q.company_name && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><Building2 size={12} /> Company</p>
                                      <p className="text-sm font-medium text-gray-800">{q.company_name}</p>
                                    </div>
                                  )}
                                </div>

                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Products ({items.length})</p>
                                <div className="space-y-2">
                                  {items.map((it: any, idx: number) => {
                                    const pLink = it.product_handle ? `/product/${it.product_handle}` : it.product_id?.startsWith("prod_") ? `/product/${it.product_id}` : null;
                                    return (
                                    <div key={idx} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                                      {pLink ? (
                                        <Link href={pLink} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-white block hover:ring-2 hover:ring-brand-navy/20 transition-all">
                                          {it.product_thumbnail ? (
                                            <img src={it.product_thumbnail} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <span className="w-full h-full flex items-center justify-center"><FileText size={16} className="text-gray-300" /></span>
                                          )}
                                        </Link>
                                      ) : (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-white flex items-center justify-center">
                                          {it.product_thumbnail ? (
                                            <img src={it.product_thumbnail} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <FileText size={16} className="text-gray-300" />
                                          )}
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        {pLink ? (
                                          <Link href={pLink} className="text-sm font-medium text-gray-800 truncate block hover:text-brand-navy transition-colors">{it.product_name || it.product_id}</Link>
                                        ) : (
                                          <p className="text-sm font-medium text-gray-800 truncate">{it.product_name || it.product_id}</p>
                                        )}
                                        {it.notes && <p className="text-xs text-gray-400 italic mt-0.5 truncate">Note: {it.notes}</p>}
                                      </div>
                                      <span className="text-sm text-gray-500 flex-shrink-0 bg-white px-2 py-0.5 rounded border border-gray-100">× {it.quantity}</span>
                                    </div>
                                    );
                                  })}
                                </div>

                                {q.message && (
                                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1.5"><MessageSquare size={12} /> Message</p>
                                    <p className="text-sm text-gray-700">{q.message}</p>
                                  </div>
                                )}

                                <p className="text-xs text-gray-400 mt-3 text-right">
                                  Submitted {new Date(q.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
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
