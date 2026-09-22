import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="px-6 py-8 md:px-8 md:py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Image gallery skeleton */}
        <div className="flex-1">
          <Skeleton className="aspect-square w-full rounded" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded" />
            ))}
          </div>
        </div>

        {/* Details skeleton */}
        <div className="flex-1 space-y-4">
          <Skeleton variant="text" className="h-5 w-20 rounded-full" />
          <Skeleton variant="text" className="h-8 w-3/4" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-5/6" />
          <div className="pt-4">
            <Skeleton variant="text" className="h-4 w-16" />
            <div className="mt-2 flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <Skeleton variant="text" className="h-10 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
