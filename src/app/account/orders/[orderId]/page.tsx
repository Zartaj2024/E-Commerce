import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderDetail } from "@/actions/account";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

function formatPrice(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TIMELINE_STEPS = [
  { key: "payment_confirmed", label: "Payment confirmed" },
  { key: "in_production", label: "In production" },
  { key: "quality_check", label: "Quality check" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const { success, order, error } = await getOrderDetail(orderId);

  if (!success || !order) notFound();

  const currentStepIndex = TIMELINE_STEPS.findIndex(
    (s) => s.key === order.status
  );
  const isCancelled = order.status === "cancelled";

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/account/orders"
          className="font-body text-sm text-mahogany hover:underline"
        >
          ← Back to orders
        </Link>
      </div>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="mt-1 font-body text-sm text-charcoal">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Tracking Timeline */}
      <div className="mb-8 rounded-lg border border-charcoal/20 bg-white p-6">
        <h2 className="mb-4 font-display text-lg text-ink">Tracking</h2>
        <div className="flex items-center">
          {TIMELINE_STEPS.map((step, i) => {
            const isCompleted = !isCancelled && i <= currentStepIndex;
            const isCurrent = !isCancelled && i === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full font-body text-xs font-medium",
                      isCompleted
                        ? "bg-peacock text-kora"
                        : "border border-charcoal/30 bg-kora text-charcoal",
                      isCurrent ? "ring-2 ring-peacock/30" : "",
                    ].join(" ")}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <span
                    className={[
                      "mt-2 text-center font-body text-xs",
                      isCompleted ? "text-peacock" : "text-charcoal",
                    ].join(" ")}
                  >
                    {step.label}
                  </span>
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={[
                      "mx-2 h-0.5 flex-1",
                      !isCancelled && i < currentStepIndex
                        ? "bg-peacock"
                        : "bg-charcoal/20",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>
        {isCancelled && (
          <p className="mt-4 text-center font-body text-sm text-mahogany">
            This order has been cancelled.
          </p>
        )}
      </div>

      {/* Order Items */}
      <div className="mb-8 rounded-lg border border-charcoal/20 bg-white p-6">
        <h2 className="mb-4 font-display text-lg text-ink">Items</h2>
        <div className="divide-y divide-charcoal/10">
          {order.order_items.map((item) => {
            const productName =
              item.product_variants?.products?.name ?? "Custom order";
            const variant = [
              item.product_variants?.fabric,
              item.product_variants?.color,
              item.product_variants?.size,
            ]
              .filter(Boolean)
              .join(" / ");

            return (
              <div key={item.id} className="flex items-center gap-4 py-3">
                <div className="h-16 w-16 shrink-0 rounded bg-kora">
                  {item.product_variants?.products?.product_images?.[0] && (
                    <img
                      src={item.product_variants.products.product_images[0].url}
                      alt={
                        item.product_variants.products.product_images[0]
                          .alt_text
                      }
                      className="h-full w-full rounded object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm text-ink">{productName}</p>
                  {variant && (
                    <p className="font-body text-xs text-charcoal">{variant}</p>
                  )}
                  <p className="font-body text-xs text-charcoal">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-body text-sm text-ink">
                  {formatPrice(item.line_total)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary + Address */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-charcoal/20 bg-white p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Summary</h2>
          <div className="space-y-2 font-body text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal">Subtotal</span>
              <span className="text-ink">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal">Shipping</span>
              <span className="text-ink">Free</span>
            </div>
            <div className="border-t border-charcoal/10 pt-2">
              <div className="flex justify-between font-medium">
                <span className="text-ink">Total</span>
                <span className="text-ink">{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="border-t border-charcoal/10 pt-2">
              <span className="text-charcoal">Payment: </span>
              <span className="capitalize text-ink">
                {order.payment_method.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {order.addresses && (
          <div className="rounded-lg border border-charcoal/20 bg-white p-6">
            <h2 className="mb-4 font-display text-lg text-ink">
              Shipping address
            </h2>
            <div className="font-body text-sm text-charcoal">
              <p className="text-ink">{order.addresses.full_name}</p>
              <p>{order.addresses.address_line1}</p>
              {order.addresses.address_line2 && (
                <p>{order.addresses.address_line2}</p>
              )}
              <p>
                {order.addresses.city}
                {order.addresses.postal_code &&
                  `, ${order.addresses.postal_code}`}
              </p>
              <p className="mt-1">{order.addresses.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
