"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import algoliasearch from "algoliasearch/lite";
import { formatPriceDollars } from "@/lib/utils";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);
const INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "connect_barcodes_products";

type Hit = {
  objectID: string;
  title: string;
  handle: string;
  thumbnail: string;
  brand: string;
  price: number;
};

type Props = {
  variant?: "navbar" | "standalone";
};

export default function SearchBox({ variant = "navbar" }: Props) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const router = useRouter();

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setHits([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    client
      .search([{ indexName: INDEX, query: q, params: { hitsPerPage: 6, filters: "status:published" } }])
      .then((res) => {
        const results = (res.results[0] as any).hits as Hit[];
        setHits(results);
        setOpen(true);
      })
      .catch(() => setHits([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const isNavbar = variant === "navbar";

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { if (hits.length > 0) setOpen(true); }}
            placeholder="Search for scanners, printers, POS systems..."
            className={
              isNavbar
                ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-lg px-4 py-2.5 pr-20 text-sm focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all duration-200"
                : "w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            }
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setHits([]); setOpen(false); inputRef.current?.focus(); }}
                className={isNavbar ? "text-white/40 hover:text-white/70 p-1" : "text-gray-400 hover:text-gray-600 p-1"}
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className={isNavbar ? "text-white/60 hover:text-white p-1" : "text-gray-400 hover:text-gray-600 p-1"}
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </form>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[60]">
          {loading && hits.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Searching...</div>
          )}
          {!loading && hits.length === 0 && query.trim() && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No products found</div>
          )}
          {hits.length > 0 && (
            <>
              <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
                {hits.map((hit) => (
                  <Link
                    key={hit.objectID}
                    href={`/product/${hit.handle || hit.objectID}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {hit.thumbnail ? (
                        <Image src={hit.thumbnail} alt={hit.title} fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Search size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{hit.title}</p>
                      {hit.brand && <p className="text-xs text-gray-500">{hit.brand}</p>}
                    </div>
                    {hit.price > 0 && (
                      <span className="text-sm font-bold text-brand-navy flex-shrink-0">
                        {formatPriceDollars(hit.price)}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <Link
                href={`/products?q=${encodeURIComponent(query)}`}
                onClick={handleSelect}
                className="block px-4 py-3 text-center text-sm font-medium text-brand-blue hover:bg-gray-50 border-t border-gray-100"
              >
                View all results for &ldquo;{query}&rdquo;
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
