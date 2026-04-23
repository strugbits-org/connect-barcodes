import AdminHeader from "@/components/admin/AdminHeader";
import { Settings, Key, Bell, Globe, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Settings" subtitle="Configure your store" />

      <div className="p-6 max-w-2xl space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-brand-navy" />
            <h2 className="font-bold text-gray-900">Store Information</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Store Name", value: "ConnectBarcodes" },
              { label: "Store URL", value: "https://connectbarcodes.com" },
              { label: "Support Email", value: "sales@connectbarcodes.com" },
              { label: "Support Phone", value: "1-800-BARCODE" },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
                <input defaultValue={value} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              </div>
            ))}
            <button className="btn-primary mt-2">Save Changes</button>
          </div>
        </div>

        {/* Admin Password */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-brand-navy" />
            <h2 className="font-bold text-gray-900">Admin Password</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Password</label>
              <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">New Password</label>
              <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <button className="btn-primary">Update Password</button>
          </div>
        </div>

        {/* API Keys (read-only display) */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Key size={18} className="text-brand-navy" />
            <h2 className="font-bold text-gray-900">Integration Keys</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Stripe Publishable Key", value: "pk_test_51Qc38IF7..." },
              { label: "Algolia App ID", value: "20C3UUXFBH" },
              { label: "Algolia Index", value: "connect_barcodes_products" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-mono text-gray-700 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
