"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getProducts } from "@/lib/medusa";
import { formatPrice } from "@/lib/utils";
import { Search, X, Package } from "lucide-react";
import Image from "next/image";

type ProductResult = {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  metadata?: Record<string, any>;
  variants?: Array<{
    id: string;
    sku?: string;
    calculated_price?: { calculated_amount: number };
    prices?: Array<{ amount: number }>;
  }>;
};

export type SelectedProduct = {
  id: string;
  title: string;
  sku: string;
};

type Props = {
  value: SelectedProduct | null;
  onChange: (product: SelectedProduct | null) => void;
  placeholder?: string;
  excludeIds?: string[];
  excludeTitles?: string[];
};

export default function ProductAutocomplete({ value, onChange, placeholder = "Search products...", excludeIds = [], excludeTitles = [] }: Props) {
  const [query, setQuery] = useState(value?.title ?? "");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getProducts({ q, limit: 8 });
      setResults((data?.products as ProductResult[]) ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (text: string) => {
    setQuery(text);
    if (value) onChange(null);
    setIsOpen(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(text), 300);
  };

  const handleSelect = (product: ProductResult) => {
    const sku = product.variants?.[0]?.sku || "";
    const selected: SelectedProduct = { id: product.id, title: product.title, sku };
    setQuery(product.title);
    onChange(selected);
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    onChange(null);
    setResults([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { if (query.length >= 2 && !value) setIsOpen(true); }}
          placeholder={placeholder}
          className={`input-field pl-9 pr-8 ${value ? "border-green-300 bg-green-50" : ""}`}
        />
        {query && (
          <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (query.length >= 2) && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg max-h-64 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          )}
          {!loading && (() => {
            const available = results.filter((p) => !excludeIds.includes(p.id) && !excludeTitles.includes(p.title));
            if (available.length === 0 && query.length >= 2) {
              return <div className="px-4 py-3 text-sm text-gray-400">
                {results.length > 0 ? "All matching products already added" : "No products found"}
              </div>;
            }
            return available.map((product) => {
            const variant = product.variants?.[0];
            const price = variant?.calculated_price?.calculated_amount ?? variant?.prices?.[0]?.amount ?? 0;
            const sku = variant?.sku;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelect(product)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                  {product.thumbnail ? (
                    <Image src={product.thumbnail} alt="" width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={16} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{product.title}</div>
                  {sku && <div className="text-xs text-gray-400">SKU: {sku}</div>}
                </div>
                {price > 0 && (
                  <div className="text-sm font-semibold text-brand-navy flex-shrink-0">{formatPrice(price)}</div>
                )}
              </button>
            );
          });
          })()}
        </div>
      )}
    </div>
  );
}
