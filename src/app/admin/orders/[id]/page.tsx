"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateOrderStatus } from "@/actions/admin";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import type { OrderWithDetails } from "@/lib/domain/order";
import type { OrderStatus } from "@/lib/domain/order";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "payment_confirmed", label: "Payment confirmed" },
  { value: "in_production", label: "In production" },
  { value: "quality_check", label: "Quality check" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("orders")
      .select(
        "*, order_items(*, product_variants(fabric, color, size, products(name, slug, product_images(url, alt_text))), custom_order_requests(reference_image_url, fabric, size_placement)), addresses(full_name, phone, address_line1, address_line2, city, postal_code)"
      )
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setOrder(data as unknown as OrderWithDetails);
        setLoading(false);
      });
  }, [id]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setUpdating(true);
    const result = await updateOrderStatus(id, newStatus);
    if (result.success) {
      setOrder((prev) =>
        prev ? { ...prev, status: newStatus } : prev
      );
    }
    setUpdating(false);
  };

  if (loading) {
    return <p className="font-body text-charcoal">Loading order...</p>;
  }

  if (!order) {
    return <p className="font-body text-mahogany">Order not found.</p>;
  }

  const address = order.addresses;

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-4 font-body text-sm text-peacock hover:underline"
      >
        ← Back to orders
      </button>

      <div className="flex items-center gap-4">
        <h1 className="font-heading text-3xl text-ink">
          Order {order.id.slice(0, 8).toUpperCase()}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Order items */}
        <div>
          <h2 className="font-heading text-lg text-ink">Items</h2>
          <div className="mt-4 space-y-4">
            {order.order_items?.map((item) => {
              const variant = item.product_variants;
              const product = variant?.products;
              const custom = item.custom_order_request_id
                ? item.custom_order_requests
                : null;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded border border-charcoal/20 p-4"
                >
                  {custom ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={custom.reference_image_url}
                        alt="Custom order"
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div>
                        <p className="font-body text-sm font-medium text-ink">
                          Custom order
                        </p>
                        <p className="font-body text-xs text-charcoal">
                          {custom.fabric} · {custom.size_placement}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {product?.product_images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.product_images[0].url}
                          alt={product.product_images[0].alt_text}
                          className="h-16 w-16 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-body text-sm font-medium text-ink">
                          {product?.name ?? "Product"}
                        </p>
                        <p className="font-body text-xs text-charcoal">
                          {variant?.fabric}
                          {variant?.color ? ` · ${variant.color}` : ""}
                          {variant?.size ? ` · ${variant.size}` : ""}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="ml-auto text-right">
                    <p className="font-body text-sm text-ink">
                      Rs. {item.line_total.toLocaleString("en-PK")}
                    </p>
                    <p className="font-body text-xs text-charcoal">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-6 rounded border border-charcoal/20 p-4">
            <div className="flex justify-between font-body text-sm text-charcoal">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString("en-PK")}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-charcoal/20 pt-2 font-body text-base text-ink">
              <span className="font-medium">Total</span>
              <span className="font-heading text-mahogany">
                Rs. {order.total.toLocaleString("en-PK")}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status update */}
          <div className="rounded border border-charcoal/20 p-4">
            <h3 className="font-body text-xs text-charcoal">Update status</h3>
            <select
              value={order.status}
              onChange={(e) =>
                handleStatusUpdate(e.target.value as OrderStatus)
              }
              disabled={updating}
              className="mt-2 w-full rounded border border-charcoal/30 bg-kora px-3 py-2 font-body text-sm text-ink outline-none focus:border-peacock"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Shipping address */}
          {address && (
            <div className="rounded border border-charcoal/20 p-4">
              <h3 className="font-body text-xs text-charcoal">
                Shipping address
              </h3>
              <div className="mt-2 font-body text-sm text-ink">
                <p className="font-medium">{address.full_name}</p>
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>
                  {address.city}
                  {address.postal_code ? `, ${address.postal_code}` : ""}
                </p>
                <p className="text-charcoal">{address.phone}</p>
              </div>
            </div>
          )}

          {/* Payment info */}
          <div className="rounded border border-charcoal/20 p-4">
            <h3 className="font-body text-xs text-charcoal">Payment</h3>
            <div className="mt-2 font-body text-sm text-ink">
              <p className="capitalize">
                {order.payment_method === "cod"
                  ? "Cash on Delivery"
                  : order.payment_method === "bank_transfer"
                    ? "Bank Transfer"
                    : "Stripe"}
              </p>
              <p className="text-charcoal capitalize">
                Status: {order.payment_status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
