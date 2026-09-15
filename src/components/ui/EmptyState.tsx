interface EmptyStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="font-heading text-lg text-ink">{title}</p>
      <p className="mt-2 max-w-sm font-body text-sm text-charcoal">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
