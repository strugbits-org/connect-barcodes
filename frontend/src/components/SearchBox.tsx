"use client";

import { InstantSearch, SearchBox, Hits, Configure } from "react-instantsearch";
import { algoliaClient, ALGOLIA_INDEX, AlgoliaProduct } from "@/lib/algolia";
import Image from "next/image";
import Link from "next/link";
import { formatPriceDollars } from "@/lib/utils";

function Hit({ hit }: { hit: AlgoliaProduct }) {
  return (
    <Link href={`/product/${hit.handle || hit.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      {hit.thumbnail && (
        <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image src={hit.thumbnail} alt={hit.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{hit.title}</p>
        <p className="text-xs text-gray-500">{hit.brand}</p>
      </div>
      <span className="text-sm font-bold text-brand-navy flex-shrink-0">{formatPriceDollars(hit.price)}</span>
    </Link>
  );
}

type Props = { onClose?: () => void };

export default function AlgoliaSearch({ onClose }: Props) {
  return (
    <InstantSearch searchClient={algoliaClient} indexName={ALGOLIA_INDEX}>
      <Configure hitsPerPage={6} filters="status:published" />
      <div className="relative">
        <SearchBox
          placeholder="Search products..."
          classNames={{
            root: "relative",
            input: "w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue",
            submit: "hidden",
            reset: "absolute right-3 top-3 text-gray-400",
          }}
        />
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <Hits hitComponent={Hit as any} />
        </div>
      </div>
    </InstantSearch>
  );
}
