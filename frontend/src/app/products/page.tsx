import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { Filter, Grid, List } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "All Products", description: "Browse our full catalog of barcode scanners, label printers, and POS systems." };

const CATEGORIES = [
  { name: "All", handle: "" },
  { name: "Barcode Scanners", handle: "barcode-scanners" },
  { name: "Label Printers", handle: "label-printers" },
  { name: "Receipt Printers", handle: "receipt-printers" },
  { name: "Mobile Computers", handle: "mobile-computers" },
  { name: "POS Systems", handle: "pos-systems" },
  { name: "Supplies & Media", handle: "supplies-media" },
];

const BRANDS = ["All", "Zebra", "Honeywell", "Datalogic", "Epson", "Star Micronics", "Brother"];

type Props = { searchParams: { category?: string; brand?: string; q?: string; page?: string } };

export default async function ProductsPage({ searchParams }: Props) {
  const { category, brand, q, page = "1" } = searchParams;
  const offset = (parseInt(page) - 1) * 12;

  let products: Product[] = [];
  let count = 0;

  try {
    const params: Parameters<typeof getProducts>[0] = { limit: 12, offset };
    if (category) params.category_handle = [category];
    if (q) params.q = q;

    const data = await getProducts(params);
    products = (data?.products as Product[]) ?? [];
    count = (data as any)?.count ?? 0;
  } catch {
    products = [];
    count = 0;
  }

  const totalPages = Math.ceil(count / 12);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">
              {category ? CATEGORIES.find((c) => c.handle === category)?.name ?? "Products" : "All Products"}
            </h1>
            <p className="text-gray-500 text-sm">{count > 0 ? `${count} products found` : "Browse our catalog"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><Grid size={18} /></button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="card p-4 mb-4">
              <h3 className="font-semibold text-sm mb-3 text-gray-900 flex items-center gap-2"><Filter size={14} /> Category</h3>
              <ul className="space-y-1">
                {CATEGORIES.map(({ name, handle }) => (
                  <li key={handle}>
                    <Link
                      href={handle ? `/products?category=${handle}` : "/products"}
                      className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${category === handle || (!category && !handle) ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-sm mb-3 text-gray-900">Brand</h3>
              <ul className="space-y-1">
                {BRANDS.map((b) => (
                  <li key={b}>
                    <Link
                      href={b === "All" ? `/products${category ? `?category=${category}` : ""}` : `/products?brand=${b}${category ? `&category=${category}` : ""}`}
                      className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${brand === b || (!brand && b === "All") ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {b}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {q && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                Showing results for: <strong>"{q}"</strong>
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-4">No products found</p>
                <Link href="/products" className="btn-primary">Browse All Products</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/products?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), page: String(p) })}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${parseInt(page) === p ? "bg-brand-navy text-white" : "border border-gray-200 hover:bg-gray-50"}`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
