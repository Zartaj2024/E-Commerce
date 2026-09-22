import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export default function ShopLoading() {
  return (
    <div className="px-6 py-8 md:px-8">
      {/* Header skeleton */}
      <div className="mb-8 h-10 w-48 rounded bg-charcoal/10 skeleton-shimmer" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
