"use client";

import { useState, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";

export default function Home() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (query: string, shopIds: string[]) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const params = new URLSearchParams({ q: query });
      shopIds.forEach((id) => params.append("shop_id", id));
      const res = await fetch(`/api/search?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Search failed");
      }

      const products: Product[] = json.products ?? json.offers ?? [];

      setResults(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Shopify Catalog Search
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
          Discover products across Shopify merchants
        </p>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <p className="mt-6 text-center text-red-600 dark:text-red-400">{error}</p>
        )}

        {loading && (
          <div className="mt-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <p className="mt-12 text-center text-gray-500 dark:text-gray-400">
            No products found.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
