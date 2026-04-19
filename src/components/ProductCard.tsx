import Image from "next/image";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const image = product.media?.[0];
  const { priceRange } = product;
  const priceLabel = priceRange
    ? (() => {
        const fmt = (a: number) => (a / 100).toFixed(2);
        const min = fmt(priceRange.min.amount);
        const max = fmt(priceRange.max.amount);
        return `${priceRange.min.currency} $${min}${min !== max ? ` – $${max}` : ""}`;
      })()
    : null;

  return (
    <a
      href={product.lookupUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4 flex-1">
        <h2 className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
          {product.title}
        </h2>

        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          {priceLabel && (
            <span className="text-green-600 dark:text-green-400 font-bold text-sm">
              {priceLabel}
            </span>
          )}
          {product.rating && (
            <span className="text-xs text-gray-400">
              ★ {product.rating.rating.toFixed(1)} ({product.rating.count})
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
