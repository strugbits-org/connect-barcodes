import AdminHeader from "@/components/admin/AdminHeader";
import { Users, Search, Plus, Shield, Edit } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  standard: "bg-gray-100 text-gray-700",
  tier1: "bg-blue-100 text-blue-700",
  tier2: "bg-purple-100 text-purple-700",
  tier3: "bg-amber-100 text-amber-700",
};

const TIER_LABELS: Record<string, string> = {
  standard: "Standard",
  tier1: "Tier 1 (5-10%)",
  tier2: "Tier 2 (15-20%)",
  tier3: "Tier 3 (25-30%)",
};

const DEMO_USERS = [
  { id: "1", name: "James Anderson", email: "james@acmecorp.com", company: "Acme Corp", tier: "tier3", orders: 24, joined: "Jan 2024" },
  { id: "2", name: "Sarah Johnson", email: "sarah@techretail.com", company: "Tech Retail", tier: "tier2", orders: 12, joined: "Mar 2024" },
  { id: "3", name: "Mark Wilson", email: "mark@supplyco.com", company: "Supply Co", tier: "tier1", orders: 7, joined: "Jun 2024" },
  { id: "4", name: "Lisa Chen", email: "lisa@minimart.com", company: "Mini Mart", tier: "standard", orders: 3, joined: "Sep 2024" },
  { id: "5", name: "Tom Baker", email: "tom@retailpro.com", company: "Retail Pro", tier: "tier2", orders: 15, joined: "Feb 2024" },
];

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Users & B2B Tiers" subtitle="Manage customer pricing tiers" />

      <div className="p-6">
        {/* B2B Tier summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(TIER_LABELS).map(([tier, label]) => {
            const count = DEMO_USERS.filter((u) => u.tier === tier).length;
            return (
              <div key={tier} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${TIER_COLORS[tier]}`}>
                  <Shield size={11} /> {label.split(" ")[0]} {label.split(" ")[1]}
                </div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users..." className="input-field pl-9" />
          </div>
          <button className="btn-primary"><Plus size={16} /> Add B2B Customer</button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Customer", "Company", "Pricing Tier", "Orders", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_USERS.map(({ id, name, email, company, tier, orders, joined }) => (
                <tr key={id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{name}</p>
                        <p className="text-xs text-gray-400">{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{company}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TIER_COLORS[tier]}`}>
                      {TIER_LABELS[tier]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{orders} orders</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={15} /></button>
                      <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
                        {Object.entries(TIER_LABELS).map(([value, label]) => (
                          <option key={value} value={value} selected={value === tier}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
