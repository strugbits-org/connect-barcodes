import algoliasearch from "algoliasearch/lite";

export const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export const ALGOLIA_INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "connect_barcodes_products";

export type AlgoliaProduct = {
  objectID: string;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  handle: string;
  price: number;
  categories: string[];
  brand: string;
  sku: string;
  status: string;
};
