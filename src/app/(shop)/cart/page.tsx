"use client";

import { useCartStore } from "@/store/cart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const { items } = useCartStore();

  return (
    <section className="px-6 py-12 md:px-8">
      <h1 className="font-heading text-3xl text-ink">Your cart</h1>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Browse our collection and add some hand-embroidered pieces."
          action={
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded bg-mahogany px-5 py-3 font-body text-sm text-kora transition-opacity hover:opacity-90"
            >
              Shop now
            </a>
          }
        />
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {items.map((item) => (
              <CartItem key={item.variantId} item={item} />
            ))}
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <CartSummary />
          </div>
        </div>
      )}
    </section>
  );
}
