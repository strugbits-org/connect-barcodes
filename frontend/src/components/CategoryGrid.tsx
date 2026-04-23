import Link from "next/link";
import { Search, Printer, Tag, Smartphone, Monitor, Package, Settings } from "lucide-react";

const CATEGORIES = [
  { name: "Barcode Scanners", handle: "barcode-scanners", icon: Search, count: "150+", color: "bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-100" },
  { name: "Label Printers", handle: "label-printers", icon: Printer, count: "80+", color: "bg-orange-50 border-orange-100 text-orange-600 group-hover:bg-orange-100" },
  { name: "Receipt Printers", handle: "receipt-printers", icon: Tag, count: "45+", color: "bg-green-50 border-green-100 text-green-600 group-hover:bg-green-100" },
  { name: "Mobile Computers", handle: "mobile-computers", icon: Smartphone, count: "60+", color: "bg-purple-50 border-purple-100 text-purple-600 group-hover:bg-purple-100" },
  { name: "POS Systems", handle: "pos-systems", icon: Monitor, count: "35+", color: "bg-red-50 border-red-100 text-red-600 group-hover:bg-red-100" },
  { name: "Supplies & Media", handle: "supplies-media", icon: Package, count: "200+", color: "bg-teal-50 border-teal-100 text-teal-600 group-hover:bg-teal-100" },
  { name: "Accessories", handle: "accessories", icon: Settings, count: "90+", color: "bg-gray-50 border-gray-200 text-gray-600 group-hover:bg-gray-100" },
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-brand-navy mb-3">Shop by Category</h2>
          <p className="text-gray-500 text-lg">Find the right equipment for your business needs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {CATEGORIES.map(({ name, handle, icon: Icon, count, color }) => (
            <Link
              key={handle}
              href={`/products?category=${handle}`}
              className="group card p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-3 transition-colors ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-tight">{name}</h3>
              <span className="text-xs text-gray-400">{count} products</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
