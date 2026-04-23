import AdminHeader from "@/components/admin/AdminHeader";
import { ShoppingBag, Search, Filter, Download } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const DEMO_ORDERS = [
  { id: "#1042", customer: "Acme Corp", email: "orders@acme.com", amount: "$2,450", status: "processing", items: 3, date: "Apr 23, 2026" },
  { id: "#1041", customer: "TechStart LLC", email: "purchasing@techstart.com", amount: "$890", status: "shipped", items: 2, date: "Apr 23, 2026" },
  { id: "#1040", customer: "RetailPlus Inc", email: "store@retailplus.com", amount: "$4,200", status: "delivered", items: 5, date: "Apr 22, 2026" },
  { id: "#1039", customer: "QuickMart", email: "manager@quickmart.com", amount: "$670", status: "delivered", items: 1, date: "Apr 22, 2026" },
  { id: "#1038", customer: "Store Pro", email: "admin@storepro.com", amount: "$1,340", status: "processing", items: 4, date: "Apr 21, 2026" },
  { id: "#1037", customer: "Delta Retail", email: "orders@delta.com", amount: "$560", status: "pending", items: 2, date: "Apr 21, 2026" },
];

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Orders" subtitle="Manage customer orders" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search orders..." className="input-field pl-9" />
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary gap-2 text-sm"><Filter size={15} /> Filter</button>
            <button className="btn-secondary gap-2 text-sm"><Download size={15} /> Export</button>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <button key={s} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${s === "All" ? "bg-brand-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Order", "Customer", "Items", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_ORDERS.map(({ id, customer, email, amount, status, items, date }) => (
                <tr key={id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 text-sm font-semibold text-blue-600">{id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{customer}</p>
                    <p className="text-xs text-gray-400">{email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{items} items</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900">{amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>{status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
