"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, FileText, Users,
  Settings, LogOut, Package2, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Quotes", href: "/admin/quotes", icon: FileText },
  { label: "Users / B2B", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-navy min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-orange rounded-xl flex items-center justify-center">
            <Package2 size={20} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">ConnectBarcodes</div>
            <div className="text-white/40 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-sm transition-all">
          <Settings size={18} /> Settings
        </Link>
        <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm transition-all">
          <LogOut size={18} /> Sign Out
        </Link>
      </div>
    </aside>
  );
}
