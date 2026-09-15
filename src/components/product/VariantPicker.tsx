"use client";

import type { ProductVariant } from "@/lib/domain/product";

interface VariantPickerProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

interface VariantOption {
  label: string;
  values: string[];
}

function groupVariants(variants: ProductVariant[]): VariantOption[] {
  const groups: Record<string, Set<string>> = {};

  for (const v of variants) {
    if (v.fabric) {
      if (!groups["Fabric"]) groups["Fabric"] = new Set();
      groups["Fabric"].add(v.fabric);
    }
    if (v.color) {
      if (!groups["Color"]) groups["Color"] = new Set();
      groups["Color"].add(v.color);
    }
    if (v.size) {
      if (!groups["Size"]) groups["Size"] = new Set();
      groups["Size"].add(v.size);
    }
  }

  return Object.entries(groups).map(([label, values]) => ({
    label,
    values: [...values],
  }));
}

function findMatchingVariant(
  variants: ProductVariant[],
  fabric: string | null,
  color: string | null,
  size: string | null
): ProductVariant | undefined {
  return variants.find(
    (v) =>
      (fabric === null || v.fabric === fabric) &&
      (color === null || v.color === color) &&
      (size === null || v.size === size)
  );
}

export function VariantPicker({
  variants,
  selectedVariantId,
  onSelect,
}: VariantPickerProps) {
  const selected = variants.find((v) => v.id === selectedVariantId);
  const groups = groupVariants(variants);

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const currentValue =
          group.label === "Fabric"
            ? selected?.fabric
            : group.label === "Color"
              ? selected?.color
              : selected?.size;

        return (
          <div key={group.label}>
            <p className="mb-2 font-body text-xs text-charcoal">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const isActive = currentValue === value;

                const nextFabric =
                  group.label === "Fabric" ? value : selected?.fabric ?? null;
                const nextColor =
                  group.label === "Color" ? value : selected?.color ?? null;
                const nextSize =
                  group.label === "Size" ? value : selected?.size ?? null;

                const matching = findMatchingVariant(
                  variants,
                  nextFabric,
                  nextColor,
                  nextSize
                );

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      if (matching) onSelect(matching.id);
                    }}
                    disabled={!matching}
                    className={[
                      "rounded-full border px-3 py-1.5 font-body text-xs transition-colors",
                      isActive
                        ? "border-mahogany bg-mahogany text-kora"
                        : "border-charcoal/30 bg-transparent text-ink hover:border-mahogany",
                      !matching && "cursor-not-allowed opacity-40",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
