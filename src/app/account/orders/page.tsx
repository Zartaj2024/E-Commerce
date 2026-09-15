"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/actions/account";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import type { Order } from "@/lib/domain/order";

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

const STATUS_OPTIONS = [
  { value: "all", label: "All orders" },
  { value: "payment_confirmed", label: "Payment confirmed" },
  { value: "in_production", label: "In production" },
  { value: "quality_check", label: "Quality check" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    getOrders().then(({ orders }) => {
      setOrders(orders);
      setLoading(false);
    });
  }, []);

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-mahogany border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Orders</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={[
              "rounded-full px-3 py-1 font-body text-xs transition-colors",
              statusFilter === opt.value
                ? "bg-mahogany text-kora"
                : "border border-charcoal/20 text-charcoal hover:bg-kora",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-charcoal/20 bg-white p-8 text-center">
          <p className="font-body text-charcoal">
            {orders.length === 0
              ? "You haven't placed any orders yet."
              : "No orders match this filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-charcoal/20 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal/10 bg-kora/50">
                <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                  Order
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                  Payment
                </th>
                <th className="px-4 py-3 text-right font-body text-xs font-medium uppercase tracking-wider text-charcoal">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-kora/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="font-body text-sm text-mahogany hover:underline"
                    >
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 font-body text-sm capitalize text-charcoal">
                    {order.payment_method.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-right font-body text-sm text-ink">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
