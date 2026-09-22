"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import {
  calculateSubtotal,
  calculateShipping,
  calculateTotal,
  formatPrice,
} from "@/lib/services/pricing";

export function CartSummary() {
  const { items, getTotal } = useCartStore();
  const subtotal = getTotal();
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal(subtotal, shipping);
  const reduce = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <div className="rounded border border-charcoal/20 p-6">
      <h2 className="font-heading text-lg text-ink">Order summary</h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between font-body text-sm text-charcoal">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between font-body text-sm text-charcoal">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>

        {shipping === 0 && (
          <p className="font-body text-xs text-peacock">
            Free shipping on orders above Rs. 5,000
          </p>
        )}

        <div className="border-t border-charcoal/20 pt-3">
          <div className="flex justify-between font-body text-base text-ink">
            <span className="font-medium">Total</span>
            <motion.span
              key={total}
              initial={reduce ? false : { scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="font-heading text-mahogany"
            >
              {formatPrice(total)}
            </motion.span>
          </div>
        </div>
      </div>

      <Link href="/checkout">
        <Button fullWidth className="mt-6">
          Proceed to checkout
        </Button>
      </Link>

      <Link
        href="/products"
        className="mt-3 block text-center font-body text-sm text-peacock hover:underline"
      >
        Continue shopping
      </Link>
    </div>
  );
}
