"use client";

import { THREAD_COLORS } from "@/lib/domain/customOrder";

interface ThreadColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
  error?: string;
}

export function ThreadColorPicker({
  value,
  onChange,
  error,
}: ThreadColorPickerProps) {
  const toggle = (color: string) => {
    if (value.includes(color)) {
      onChange(value.filter((c) => c !== color));
    } else if (value.length < 6) {
      onChange([...value, color]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-body text-xs text-charcoal">
          Thread colors
        </label>
        <span className="font-body text-xs text-charcoal">
          {value.length}/6 selected
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {THREAD_COLORS.map((color) => (
          <button
            key={color.name}
            type="button"
            onClick={() => toggle(color.name)}
            className="group flex flex-col items-center gap-1.5"
          >
            <div
              className={[
                "h-8 w-8 rounded-full border-2 transition-all",
                value.includes(color.name)
                  ? "border-peacock scale-110 ring-2 ring-peacock/30"
                  : "border-charcoal/20 group-hover:border-charcoal/40",
              ].join(" ")}
              style={{ backgroundColor: color.hex }}
            />
            <span className="font-body text-[10px] leading-tight text-charcoal">
              {color.name}
            </span>
          </button>
        ))}
      </div>
      {error && (
        <p className="font-body text-xs text-mahogany">{error}</p>
      )}
    </div>
  );
}
