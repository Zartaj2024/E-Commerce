"use client";

import { SIZE_PLACEMENT_OPTIONS } from "@/lib/domain/customOrder";

interface SizePlacementPickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SizePlacementPicker({
  value,
  onChange,
  error,
}: SizePlacementPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block font-body text-xs text-charcoal">
        Size & placement
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SIZE_PLACEMENT_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={[
              "rounded border px-4 py-3 text-left font-body text-sm transition-all",
              value === option
                ? "border-peacock bg-peacock/10 text-peacock"
                : "border-charcoal/30 text-ink hover:border-charcoal/50",
            ].join(" ")}
          >
            {option}
          </button>
        ))}
      </div>
      {error && (
        <p className="font-body text-xs text-mahogany">{error}</p>
      )}
    </div>
  );
}
