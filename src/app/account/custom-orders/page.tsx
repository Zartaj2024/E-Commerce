"use client";

import { useEffect, useState } from "react";
import { getCustomOrders } from "@/actions/account";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomOrders().then(({ orders }) => {
      setOrders(orders);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mahogany border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Custom orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-charcoal/20 bg-white p-8 text-center">
          <p className="mb-4 font-body text-charcoal">
            You haven&apos;t submitted any custom orders yet.
          </p>
          <a
            href="/custom-order"
            className="inline-block rounded-lg bg-mahogany px-6 py-2.5 font-body text-sm text-kora transition-colors hover:bg-mahogany/90"
          >
            Start a custom order
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-start gap-4 rounded-lg border border-charcoal/20 bg-white p-4"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-kora">
                {order.reference_image_url && (
                  <img
                    src={order.reference_image_url}
                    alt={order.image_alt_text || "Reference"}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-body text-xs text-charcoal">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <p className="font-body text-sm text-ink">
                  {order.fabric} · {order.size_placement}
                </p>
                {order.thread_colors &&
                  order.thread_colors.length > 0 && (
                    <p className="font-body text-xs text-charcoal">
                      Thread: {order.thread_colors.join(", ")}
                    </p>
                  )}
                {order.notes && (
                  <p className="mt-1 font-body text-xs italic text-charcoal">
                    &quot;{order.notes}&quot;
                  </p>
                )}
                {order.quoted_price && (
                  <p className="mt-2 font-body text-sm font-medium text-ink">
                    Quoted: {formatPrice(order.quoted_price)}
                  </p>
                )}
                {order.admin_notes && (
                  <p className="mt-1 font-body text-xs text-charcoal">
                    Note: {order.admin_notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
