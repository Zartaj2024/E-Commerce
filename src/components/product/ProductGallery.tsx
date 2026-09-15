"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/domain/product";

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded bg-charcoal/5">
        {active ? (
          <Image
            src={active.url}
            alt={active.alt_text}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-charcoal">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={[
                "relative h-16 w-16 overflow-hidden rounded border-2 transition-colors",
                i === activeIndex
                  ? "border-mahogany"
                  : "border-transparent hover:border-charcoal/20",
              ].join(" ")}
            >
              <Image
                src={img.url}
                alt={img.alt_text}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
