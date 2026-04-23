"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package2, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        toast.success("Welcome to admin!");
        router.push("/admin");
      } else {
        toast.error("Invalid password");
      }
    } catch {
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ConnectBarcodes</h1>
          <p className="text-white/60 text-sm">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-brand-navy" />
            <h2 className="font-bold text-brand-navy">Admin Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter admin password"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
