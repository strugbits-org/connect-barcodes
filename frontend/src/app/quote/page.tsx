"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitQuote } from "@/lib/medusa";
import { CheckCircle, Plus, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";

type QuoteItem = { product_id: string; quantity: number; notes: string };

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "", customer_email: "", company_name: "", phone: "", message: "",
  });
  const [items, setItems] = useState<QuoteItem[]>([{ product_id: "", quantity: 1, notes: "" }]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const updateItem = (idx: number, field: keyof QuoteItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, { product_id: "", quantity: 1, notes: "" }]);
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitQuote({ ...formData, items: items.filter((i) => i.product_id) });
      setSubmitted(true);
      toast.success("Quote request submitted!");
    } catch {
      toast.error("Failed to submit quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-brand-navy mb-4">Quote Request Received!</h1>
          <p className="text-gray-500 text-lg mb-8">
            Thank you! Our B2B team will review your request and respond within 1 business day.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-secondary mr-4">Submit Another</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm px-4 py-1.5 rounded-full mb-4">
            <Tag size={14} /> B2B Pricing Available
          </div>
          <h1 className="text-3xl font-bold text-brand-navy mb-3">Request a Quote</h1>
          <p className="text-gray-500">Get custom B2B pricing for your business. Our team responds within 1 business day.</p>
        </div>

        <div className="card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact info */}
            <div>
              <h2 className="font-bold text-brand-navy mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "customer_name", label: "Full Name *" },
                  { name: "company_name", label: "Company Name" },
                  { name: "customer_email", label: "Email Address *", type: "email" },
                  { name: "phone", label: "Phone Number", type: "tel" },
                ].map(({ name, label, type = "text" }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={(formData as any)[name]}
                      onChange={handleChange}
                      required={label.includes("*")}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h2 className="font-bold text-brand-navy mb-4">Products Needed</h2>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Product name or SKU (e.g., Zebra ZT411, ZD421)"
                        value={item.product_id}
                        onChange={(e) => updateItem(idx, "product_id", e.target.value)}
                        className="input-field mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Additional notes (color, config, etc.)"
                        value={item.notes}
                        onChange={(e) => updateItem(idx, "notes", e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-gray-400 mb-1">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                        className="input-field text-center"
                      />
                    </div>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)} className="mt-6 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 font-medium">
                <Plus size={16} /> Add Another Product
              </button>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Additional Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your business needs, timeline, or any special requirements..."
                className="input-field resize-none"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5">
              {loading ? "Submitting..." : "Submit Quote Request"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to be contacted by our B2B team via email or phone.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
