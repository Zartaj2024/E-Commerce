import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <span className="block font-heading text-8xl font-medium text-charcoal/15">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-24 rotate-12 border-t-2 border-dashed border-mahogany/40" />
        </div>
      </div>

      <h1 className="font-heading text-2xl text-ink">Page not found</h1>
      <p className="mt-3 max-w-sm font-body text-sm text-charcoal">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded bg-mahogany px-5 py-3 font-body text-sm text-kora transition-all duration-200 hover:shadow-lg hover:shadow-mahogany/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
