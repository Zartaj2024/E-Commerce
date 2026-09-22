import { Skeleton } from "@/components/ui/Skeleton";

export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar skeleton */}
        <nav className="w-full shrink-0 md:w-56">
          <Skeleton variant="text" className="h-6 w-24" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="text" className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </nav>

        {/* Content skeleton */}
        <main className="min-w-0 flex-1 space-y-4">
          <Skeleton variant="text" className="h-8 w-48" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-5/6" />
          <Skeleton variant="text" className="h-4 w-2/3" />
        </main>
      </div>
    </div>
  );
}
