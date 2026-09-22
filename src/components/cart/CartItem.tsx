"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useCartStore, type CartItem as CartItemType } from "@/store/cart";
import { formatPrice } from "@/lib/services/pricing";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const reduce = useReducedMotion();

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={
        reduce
          ? undefined
          : { opacity: 0, x: -16, transition: { duration: 0.2 } }
      }
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 py-4 border-b border-charcoal/10"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.name}
        className="h-20 w-20 rounded object-cover"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-body text-sm text-ink">{item.name}</h3>
          <div className="mt-0.5 flex flex-wrap gap-1 font-body text-xs text-charcoal">
            {item.fabric && <span>{item.fabric}</span>}
            {item.color && <span> · {item.color}</span>}
            {item.size && <span> · {item.size}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.variantId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="flex h-7 w-7 items-center justify-center rounded border border-charcoal/30 font-body text-sm text-ink transition-all duration-200 hover:bg-charcoal/5 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              −
            </button>
            <motion.span
              key={item.quantity}
              initial={reduce ? false : { scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-6 text-center font-body text-sm text-ink"
            >
              {item.quantity}
            </motion.span>
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.variantId, item.quantity + 1)
              }
              className="flex h-7 w-7 items-center justify-center rounded border border-charcoal/30 font-body text-sm text-ink transition-all duration-200 hover:bg-charcoal/5 hover:scale-105 active:scale-95"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-mahogany">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.variantId)}
              className="font-body text-xs text-charcoal hover:text-mahogany transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
