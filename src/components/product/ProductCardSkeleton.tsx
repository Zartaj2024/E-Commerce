import { Skeleton } from "@/components/ui/Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="block">
      <Skeleton className="aspect-[4/5] w-full rounded" />
      <div className="mt-3 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
    </div>
  );
}
