interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending_review: {
    label: "Pending review",
    className: "bg-charcoal text-kora",
  },
  quoted: {
    label: "Quoted",
    className: "bg-zari-gold text-kora",
  },
  declined: {
    label: "Declined",
    className: "bg-mahogany text-kora",
  },
  converted: {
    label: "Converted",
    className: "bg-peacock text-kora",
  },
  payment_confirmed: {
    label: "Payment confirmed",
    className: "bg-charcoal text-kora",
  },
  in_production: {
    label: "In production",
    className: "bg-peacock text-kora",
  },
  quality_check: {
    label: "Quality check",
    className: "bg-zari-gold text-kora",
  },
  shipped: {
    label: "Shipped",
    className: "bg-peacock text-kora",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-700 text-kora",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-mahogany text-kora",
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-charcoal text-kora",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs whitespace-nowrap",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
