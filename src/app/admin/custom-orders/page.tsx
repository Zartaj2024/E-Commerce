"use client";

import { useState, useEffect } from "react";
import { getAllCustomOrders, quoteCustomOrder, declineCustomOrder } from "@/actions/admin";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import type { CustomOrderRequest } from "@/lib/domain/customOrder";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending_review", label: "Pending" },
  { value: "quoted", label: "Quoted" },
  { value: "declined", label: "Declined" },
  { value: "converted", label: "Converted" },
];

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrderRequest[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [quoteModal, setQuoteModal] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllCustomOrders(filter === "all" ? undefined : filter).then((res) => {
      if (res.success) setOrders(res.orders);
      setLoading(false);
    });
  }, [filter]);

  const handleQuote = async (requestId: string) => {
    const price = parseFloat(quotePrice);
    if (isNaN(price) || price <= 0) return;

    const result = await quoteCustomOrder(requestId, price, quoteNotes);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === requestId
            ? { ...o, status: "quoted", quoted_price: price, admin_notes: quoteNotes }
            : o
        )
      );
      setQuoteModal(null);
      setQuotePrice("");
      setQuoteNotes("");
    }
  };

  const handleDecline = async (requestId: string) => {
    const result = await declineCustomOrder(requestId);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === requestId ? { ...o, status: "declined" } : o
        )
      );
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink">Custom Orders</h1>

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
        <p className="mt-8 font-body text-charcoal">Loading custom orders...</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 font-body text-charcoal">No custom orders found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex gap-4 rounded border border-charcoal/20 p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.reference_image_url}
                alt={order.image_alt_text}
                className="h-20 w-20 rounded object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-body text-xs text-charcoal">
                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>

                <p className="mt-1 font-body text-sm text-ink">
                  {order.fabric} · {order.thread_colors.join(", ")} ·{" "}
                  {order.size_placement}
                </p>

                {order.notes && (
                  <p className="mt-1 font-body text-xs text-charcoal">
                    &ldquo;{order.notes}&rdquo;
                  </p>
                )}

                {order.quoted_price && (
                  <p className="mt-1 font-body text-sm text-mahogany font-medium">
                    Quoted: Rs. {order.quoted_price.toLocaleString("en-PK")}
                  </p>
                )}
              </div>

              {order.status === "pending_review" && (
                <div className="flex flex-col gap-2 self-center">
                  <Button
                    onClick={() => setQuoteModal(order.id)}
                  >
                    Quote
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDecline(order.id)}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quote modal */}
      {quoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50">
          <div className="w-full max-w-sm rounded border border-charcoal/20 bg-kora p-6">
            <h2 className="font-heading text-lg text-ink">Quote price</h2>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block font-body text-xs text-charcoal">
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                />
              </div>

              <div>
                <label className="mb-1 block font-body text-xs text-charcoal">
                  Notes (optional)
                </label>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  rows={3}
                  placeholder="Any notes for the customer..."
                  className="w-full resize-none border-b border-charcoal/30 bg-transparent py-2 font-body text-sm text-ink outline-none focus:border-peacock"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setQuoteModal(null);
                  setQuotePrice("");
                  setQuoteNotes("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => handleQuote(quoteModal)}>
                Send quote
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
