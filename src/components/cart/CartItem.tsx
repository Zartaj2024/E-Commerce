"use client";

import { useCartStore, type CartItem as CartItemType } from "@/store/cart";
import { formatPrice } from "@/lib/services/pricing";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-charcoal/10">
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
              className="flex h-7 w-7 items-center justify-center rounded border border-charcoal/30 font-body text-sm text-ink transition-colors hover:bg-charcoal/5 disabled:opacity-50"
            >
              −
            </button>
            <span className="w-6 text-center font-body text-sm text-ink">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.variantId, item.quantity + 1)
              }
              className="flex h-7 w-7 items-center justify-center rounded border border-charcoal/30 font-body text-sm text-ink transition-colors hover:bg-charcoal/5"
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
    </div>
  );
}
