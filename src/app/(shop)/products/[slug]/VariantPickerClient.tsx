"use client";

import { useState } from "react";
import type { ProductVariant } from "@/lib/domain/product";
import { VariantPicker } from "@/components/product/VariantPicker";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";

interface VariantPickerClientProps {
  variants: ProductVariant[];
  basePrice: number;
  productName: string;
  productSlug: string;
  productImage: string;
}

export function VariantPickerClient({
  variants,
  basePrice,
  productName,
  productSlug,
  productImage,
}: VariantPickerClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null
  );
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const selected = variants.find((v) => v.id === selectedVariantId);

  const computedPrice = selected
    ? basePrice + selected.price_modifier
    : basePrice;

  const stockLabel =
    selected && selected.stock_quantity > 0
      ? `${selected.stock_quantity} in stock`
      : "Out of stock";

  const stockColor =
    selected && selected.stock_quantity > 0 ? "text-peacock" : "text-mahogany";

  const handleAddToCart = () => {
    if (!selected) return;

    addItem({
      variantId: selected.id,
      productId: variants[0]?.product_id ?? "",
      name: productName,
      slug: productSlug,
      imageUrl: productImage,
      fabric: selected.fabric,
      color: selected.color,
      size: selected.size,
      price: computedPrice,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      <VariantPicker
        variants={variants}
        selectedVariantId={selectedVariantId}
        onSelect={setSelectedVariantId}
      />

      <div className="flex items-center gap-4">
        <p className="font-heading text-2xl text-mahogany">
          Rs. {computedPrice.toLocaleString("en-PK")}
        </p>
        <span className={`font-body text-sm ${stockColor}`}>{stockLabel}</span>
      </div>

      <Button
        disabled={!selected || selected.stock_quantity === 0}
        fullWidth
        onClick={handleAddToCart}
      >
        {added ? "Added!" : "Add to cart"}
      </Button>
    </div>
  );
}
