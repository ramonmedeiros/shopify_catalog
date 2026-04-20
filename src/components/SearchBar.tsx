"use client";

import { useState } from "react";

interface Props {
  onSearch: (query: string, shopIds: string[]) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState("");
  const [shopIds, setShopIds] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAction = (formData: FormData) => {
    const query = formData.get("query") as string;
    const rawIds = formData.get("shopIds") as string;
    const ids = rawIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSearch(query, ids);
  };

  return (
    <form action={handleAction} className="flex flex-col gap-3 w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          name="query"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for products..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Search
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {showAdvanced ? "▲ Advanced" : "▼ Advanced"}
        </button>
        {showAdvanced && (
          <input
            type="text"
            name="shopIds"
            value={shopIds}
            onChange={(e) => setShopIds(e.target.value)}
            placeholder="Filter by shop IDs (comma-separated, optional)"
            disabled={loading}
            className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
          />
        )}
      </div>
    </form>
  );
}
