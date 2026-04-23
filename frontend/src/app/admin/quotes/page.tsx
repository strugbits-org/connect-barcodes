import AdminHeader from "@/components/admin/AdminHeader";
import { FileText, Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const DEMO_QUOTES = [
  { id: "Q-001", customer: "Acme Corporation", email: "procurement@acme.com", company: "Acme Corp", items: 5, status: "pending", date: "Apr 23, 2026", total: "~$12,450" },
  { id: "Q-002", customer: "Sarah Johnson", email: "sarah@techretail.com", company: "Tech Retail", items: 2, status: "reviewed", date: "Apr 22, 2026", total: "~$3,800" },
  { id: "Q-003", customer: "Mark Wilson", email: "mark@supplyco.com", company: "Supply Co", items: 8, status: "approved", date: "Apr 20, 2026", total: "~$24,000" },
  { id: "Q-004", customer: "Lisa Chen", email: "lisa@minimart.com", company: "Mini Mart", items: 1, status: "rejected", date: "Apr 18, 2026", total: "~$890" },
];

export default function AdminQuotesPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Quote Requests" subtitle="Manage B2B quote requests" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Pending Review", value: "3", icon: Clock, color: "bg-yellow-50 text-yellow-600" },
            { label: "Under Review", value: "1", icon: Eye, color: "bg-blue-50 text-blue-600" },
            { label: "Approved", value: "12", icon: CheckCircle, color: "bg-green-50 text-green-600" },
            { label: "Rejected", value: "2", icon: XCircle, color: "bg-red-50 text-red-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={20} /></div>
              <div>
                <div className="text-xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search quotes..." className="input-field pl-9" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Quote ID", "Customer", "Company", "Items", "Est. Value", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {DEMO_QUOTES.map(({ id, customer, email, company, items, status, date, total }) => (
                <tr key={id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-blue-600">{id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{customer}</p>
                    <p className="text-xs text-gray-400">{email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{company}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{items} products</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{total}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}>{status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={15} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle size={15} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={15} /></button>
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
