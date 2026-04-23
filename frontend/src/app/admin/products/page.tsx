import AdminHeader from "@/components/admin/AdminHeader";
import { getProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

export default async function AdminProductsPage() {
  let products: Product[] = [];
  let count = 0;

  try {
    const data = await getProducts({ limit: 50 });
    products = (data?.products as Product[]) ?? [];
    count = (data as any)?.count ?? 0;
  } catch {
    products = [];
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <AdminHeader title="Products" subtitle={`${count} products total`} />

      <div className="p-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products..." className="input-field pl-9" />
          </div>
          <Link href="/admin/products/new" className="btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Brand</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Package size={48} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400">No products yet. <Link href="/admin/products/new" className="text-blue-600">Add your first product</Link></p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const price = product.variants?.[0]?.prices?.[0]?.amount ?? 0;
                  const brand = product.metadata?.brand as string | undefined;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.thumbnail ? (
                              <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{product.title}</p>
                            <p className="text-xs text-gray-400">{product.handle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{brand ?? "-"}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{formatPrice(price)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${product.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={15} />
                          </Link>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
