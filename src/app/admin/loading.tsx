import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-kora">
      {/* Sidebar skeleton */}
      <aside className="flex h-screen w-56 flex-col border-r border-charcoal/20 bg-ink p-6">
        <Skeleton className="h-6 w-32 rounded bg-kora/10" />
        <div className="mt-8 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded bg-kora/10" />
          ))}
        </div>
      </aside>

      {/* Content skeleton */}
      <main className="flex-1 p-8">
        <Skeleton className="h-8 w-48" />
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      </main>
    </div>
  );
}
