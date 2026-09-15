"use client";

import { FABRIC_OPTIONS, type FabricOption } from "@/lib/domain/customOrder";

interface FabricPickerProps {
  value: FabricOption | "";
  onChange: (fabric: FabricOption) => void;
  error?: string;
}

export function FabricPicker({ value, onChange, error }: FabricPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block font-body text-xs text-charcoal">
        Fabric type
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FABRIC_OPTIONS.map((fabric) => (
          <button
            key={fabric}
            type="button"
            onClick={() => onChange(fabric)}
            className={[
              "rounded border px-4 py-3 font-body text-sm transition-all",
              value === fabric
                ? "border-peacock bg-peacock/10 text-peacock"
                : "border-charcoal/30 text-ink hover:border-charcoal/50",
            ].join(" ")}
          >
            {fabric}
          </button>
        ))}
      </div>
      {error && (
        <p className="font-body text-xs text-mahogany">{error}</p>
      )}
    </div>
  );
}
