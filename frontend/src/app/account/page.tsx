"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Package, Tag, LogOut, ChevronRight, Shield } from "lucide-react";
import Link from "next/link";

const TABS = ["Overview", "Orders", "Quotes", "Account Settings"] as const;
type Tab = (typeof TABS)[number];

const TIER_INFO: Record<string, { label: string; discount: string; color: string }> = {
  standard: { label: "Standard", discount: "0%", color: "bg-gray-100 text-gray-700" },
  tier1: { label: "Tier 1", discount: "5-10%", color: "bg-blue-100 text-blue-700" },
  tier2: { label: "Tier 2", discount: "15-20%", color: "bg-purple-100 text-purple-700" },
  tier3: { label: "Tier 3", discount: "25-30%", color: "bg-amber-100 text-amber-700" },
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const tier = "standard";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="card p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold text-lg">G</div>
                <div>
                  <p className="font-semibold text-gray-900">Guest User</p>
                  <p className="text-xs text-gray-400">Not signed in</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${TIER_INFO[tier].color}`}>
                <Shield size={12} /> {TIER_INFO[tier].label} · {TIER_INFO[tier].discount} off
              </div>
            </div>

            <div className="card overflow-hidden">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors border-b last:border-0 border-gray-50 ${activeTab === tab ? "bg-brand-navy text-white" : "hover:bg-gray-50 text-gray-700"}`}
                >
                  {tab} <ChevronRight size={16} className={activeTab === tab ? "text-white/60" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "Overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total Orders", value: "0", icon: Package, color: "text-blue-600 bg-blue-50" },
                    { label: "Pending Quotes", value: "0", icon: Tag, color: "text-orange-600 bg-orange-50" },
                    { label: "Pricing Tier", value: TIER_INFO[tier].label, icon: Shield, color: "text-purple-600 bg-purple-50" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="card p-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
                      <div className="text-sm text-gray-500">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="card p-6">
                  <h2 className="font-bold text-brand-navy mb-4">Sign In to View Your Account</h2>
                  <p className="text-gray-500 text-sm mb-6">Create an account or sign in to view your orders, manage quotes, and access B2B pricing.</p>
                  <div className="flex gap-3">
                    <button className="btn-primary">Sign In</button>
                    <button className="btn-secondary">Create Account</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Orders" && (
              <div className="card p-8 text-center">
                <Package size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">Sign in to view your orders</p>
              </div>
            )}

            {activeTab === "Quotes" && (
              <div className="card p-8 text-center">
                <Tag size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No quotes yet</p>
                <Link href="/quote" className="btn-primary">Request a Quote</Link>
              </div>
            )}

            {activeTab === "Account Settings" && (
              <div className="card p-6">
                <h2 className="font-bold text-brand-navy mb-4">Account Settings</h2>
                <p className="text-gray-500 text-sm">Sign in to manage your account settings.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
