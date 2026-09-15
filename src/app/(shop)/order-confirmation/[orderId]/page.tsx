import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/repositories/orderRepository";
import { formatPrice } from "@/lib/services/pricing";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({
  params,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order confirmed — Suti & Thread`,
    description: `Your order ${orderId.slice(0, 8)} has been placed successfully.`,
  };
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const order = await getOrderById(orderId, user.id);

  if (!order) {
    notFound();
  }

  return (
    <section className="px-6 py-16 md:px-8">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-peacock/10 mx-auto">
          <span className="text-2xl">✓</span>
        </div>

        <h1 className="font-heading text-3xl text-ink">Order confirmed</h1>

        <p className="mt-3 font-body text-base text-charcoal">
          Thank you for your order. We&apos;ll start working on it soon.
        </p>

        <div className="mt-8 rounded border border-charcoal/20 p-6 text-left">
          <div className="flex justify-between font-body text-sm">
            <span className="text-charcoal">Order number</span>
            <span className="text-ink font-medium">
              {order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="mt-2 flex justify-between font-body text-sm">
            <span className="text-charcoal">Payment method</span>
            <span className="text-ink capitalize">
              {order.payment_method === "cod"
                ? "Cash on Delivery"
                : order.payment_method === "bank_transfer"
                  ? "Bank Transfer"
                  : "Stripe"}
            </span>
          </div>

          <div className="mt-2 flex justify-between font-body text-sm">
            <span className="text-charcoal">Status</span>
            <span className="text-peacock capitalize">
              {order.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="mt-4 border-t border-charcoal/20 pt-4">
            <div className="flex justify-between font-body text-base text-ink">
              <span className="font-medium">Total</span>
              <span className="font-heading text-mahogany">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 font-body text-sm text-charcoal">
          {order.payment_method === "bank_transfer" && (
            <p>
              Please transfer the amount to our bank account. Your order will be
              confirmed after we verify the payment.
            </p>
          )}
          {order.payment_method === "cod" && (
            <p>
              Please keep the exact amount ready at the time of delivery.
            </p>
          )}
          {order.payment_method === "stripe" && (
            <p>
              Your payment is being processed. You&apos;ll receive a confirmation
              email shortly.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center rounded border border-charcoal/30 px-5 py-3 font-body text-sm text-ink transition-colors hover:bg-charcoal/5"
          >
            View my orders
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded bg-mahogany px-5 py-3 font-body text-sm text-kora transition-opacity hover:opacity-90"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
