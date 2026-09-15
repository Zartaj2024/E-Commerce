"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllOrders } from "@/actions/admin";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import type { Order } from "@/lib/domain/order";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "payment_confirmed", label: "Pending" },
  { value: "in_production", label: "In production" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllOrders(filter === "all" ? undefined : filter).then((res) => {
      if (res.success) setOrders(res.orders);
      setLoading(false);
    });
  }, [filter]);

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Orders</h1>

      {/* Status filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={[
              "rounded-full px-3 py-1 font-body text-xs transition-colors",
              filter === s.value
                ? "bg-ink text-kora"
                : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20",
            ].join(" ")}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 font-body text-charcoal">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 font-body text-charcoal">No orders found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-charcoal/20 text-left text-xs text-charcoal">
                <th className="pb-3 pr-4">Order #</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4 text-right">Total</th>
                <th className="pb-3 text-right">Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-charcoal/10 text-ink"
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-peacock hover:underline"
                    >
                      {order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-charcoal">
                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 pr-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    Rs. {order.total.toLocaleString("en-PK")}
                  </td>
                  <td className="py-3 text-right capitalize text-charcoal">
                    {order.payment_method === "cod"
                      ? "COD"
                      : order.payment_method === "bank_transfer"
                        ? "Bank"
                        : "Stripe"}
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
