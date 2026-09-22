"use client";

import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="font-heading text-2xl text-ink">
        Something went wrong
      </h2>
      <p className="mt-3 max-w-sm font-body text-sm text-charcoal">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="mt-6">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
