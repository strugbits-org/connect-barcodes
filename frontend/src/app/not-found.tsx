import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-8xl font-black text-gray-100 mb-4">404</div>
        <h1 className="text-2xl font-bold text-brand-navy mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary"><Home size={16} /> Go Home</Link>
          <Link href="/products" className="btn-secondary"><Search size={16} /> Browse Products</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
