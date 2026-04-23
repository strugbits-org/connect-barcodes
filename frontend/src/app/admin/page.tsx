import AdminHeader from "@/components/admin/AdminHeader";
import { Package, ShoppingBag, DollarSign, Users, TrendingUp, ArrowUpRight } from "lucide-react";

const STATS = [
  { label: "Total Revenue", value: "$48,250", change: "+12.5%", icon: DollarSign, color: "bg-green-50 text-green-600", trend: "up" },
  { label: "Total Orders", value: "284", change: "+8.2%", icon: ShoppingBag, color: "bg-blue-50 text-blue-600", trend: "up" },
  { label: "Products", value: "157", change: "+3", icon: Package, color: "bg-purple-50 text-purple-600", trend: "up" },
  { label: "B2B Customers", value: "42", change: "+5.1%", icon: Users, color: "bg-orange-50 text-orange-600", trend: "up" },
];

const RECENT_ORDERS = [
  { id: "#1042", customer: "Acme Corp", amount: "$2,450", status: "Processing", date: "Today" },
  { id: "#1041", customer: "TechStart LLC", amount: "$890", status: "Shipped", date: "Today" },
  { id: "#1040", customer: "RetailPlus", amount: "$4,200", status: "Delivered", date: "Yesterday" },
  { id: "#1039", customer: "QuickMart", amount: "$670", status: "Delivered", date: "Yesterday" },
  { id: "#1038", customer: "Store Pro", amount: "$1,340", status: "Processing", date: "2 days ago" },
];

const STATUS_COLORS: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Dashboard" subtitle={`Welcome back · ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`} />

      <div className="p-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                  <TrendingUp size={12} /> {change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Order</th>
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left">Amount</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map(({ id, customer, amount, status, date }) => (
                  <tr key={id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-brand-blue">{id}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{customer}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>{status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
