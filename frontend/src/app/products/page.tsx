import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories, getCollections } from "@/lib/medusa";
import { Product } from "@/types";
import { Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "All Products", description: "Browse our full catalog of barcode scanners, label printers, and POS systems." };

// Compact page list: first, last, current ±1, with "…" gaps.
function pageItems(current: number, total: number): (number | "dots")[] {
  const set = new Set<number>([1, total]);
  for (let p = current - 1; p <= current + 1; p++) if (p >= 1 && p <= total) set.add(p);
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "dots")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push("dots");
    out.push(p);
    prev = p;
  }
  return out;
}

type Props = { searchParams: { category?: string; brand?: string; q?: string; page?: string } };

export default async function ProductsPage({ searchParams }: Props) {
  const { category, brand, q, page = "1" } = searchParams;
  const currentPage = Math.max(1, parseInt(page) || 1);
  const offset = (currentPage - 1) * 12;

  // Categories + brands loaded from the backend so handles/ids always match.
  // Brands are modeled as collections (metadata isn't filterable by the store API).
  const [catData, colData] = await Promise.all([getCategories(), getCollections()]);
  const CATEGORIES = [
    { name: "All", handle: "", id: "" },
    ...(((catData as any)?.product_categories ?? []) as any[]).map((c) => ({ name: c.name as string, handle: c.handle as string, id: c.id as string })),
  ];
  const BRANDS = [
    { name: "All", handle: "", id: "" },
    ...(((colData as any)?.collections ?? []) as any[])
      .map((c) => ({ name: c.title as string, handle: c.handle as string, id: c.id as string }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  ];
  const activeCategoryId = CATEGORIES.find((c) => c.handle === category)?.id;
  const activeBrandId = BRANDS.find((b) => b.handle === brand)?.id;

  // Build a URL that preserves the other active filters (category/brand/q) and
  // resets pagination unless a page is given.
  const buildHref = (next: { category?: string; brand?: string; page?: string }) => {
    const cat = next.category !== undefined ? next.category : category;
    const br = next.brand !== undefined ? next.brand : brand;
    const params: Record<string, string> = {};
    if (cat) params.category = cat;
    if (br) params.brand = br;
    if (q) params.q = q;
    if (next.page) params.page = next.page;
    return `/products?${new URLSearchParams(params)}`;
  };
  const pageHref = (p: number) => buildHref({ page: String(p) });

  let products: Product[] = [];
  let count = 0;

  try {
    const params: Parameters<typeof getProducts>[0] = { limit: 12, offset };
    if (activeCategoryId) params.category_id = [activeCategoryId];
    if (activeBrandId) params.collection_id = [activeBrandId];
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
                      href={buildHref({ category: handle })}
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
              <ul className="space-y-1 max-h-80 overflow-y-auto pr-1">
                {BRANDS.map(({ name, handle }) => (
                  <li key={handle || "all"}>
                    <Link
                      href={buildHref({ brand: handle })}
                      className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${brand === handle || (!brand && !handle) ? "bg-brand-navy text-white" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
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
                  <div className="flex justify-center items-center gap-1.5 mt-10 flex-wrap">
                    {currentPage > 1 ? (
                      <Link href={pageHref(currentPage - 1)} aria-label="Previous page"
                        className="h-10 px-3 flex items-center gap-1 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                        <ChevronLeft size={16} /> Prev
                      </Link>
                    ) : (
                      <span className="h-10 px-3 flex items-center gap-1 rounded-lg text-sm font-medium border border-gray-100 text-gray-300 cursor-not-allowed">
                        <ChevronLeft size={16} /> Prev
                      </span>
                    )}

                    {pageItems(currentPage, totalPages).map((p, i) =>
                      p === "dots" ? (
                        <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 select-none">…</span>
                      ) : (
                        <Link key={p} href={pageHref(p)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === p ? "bg-brand-navy text-white" : "border border-gray-200 hover:bg-gray-50"}`}>
                          {p}
                        </Link>
                      )
                    )}

                    {currentPage < totalPages ? (
                      <Link href={pageHref(currentPage + 1)} aria-label="Next page"
                        className="h-10 px-3 flex items-center gap-1 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                        Next <ChevronRight size={16} />
                      </Link>
                    ) : (
                      <span className="h-10 px-3 flex items-center gap-1 rounded-lg text-sm font-medium border border-gray-100 text-gray-300 cursor-not-allowed">
                        Next <ChevronRight size={16} />
                      </span>
                    )}
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
