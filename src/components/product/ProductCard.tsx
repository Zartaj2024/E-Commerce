"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/lib/domain/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: reduce ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peacock"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded bg-charcoal/5 shadow-sm shadow-charcoal/5 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-charcoal/10">
          <Image
            src={product.product_images?.[0]?.url ?? "/images/placeholder.jpg"}
            alt={product.product_images?.[0]?.alt_text ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          {/* Running-stitch dashed border on hover */}
          <div className="pointer-events-none absolute inset-0 rounded border-2 border-transparent transition-[border-color] duration-300 group-hover:border-mahogany group-hover:border-dashed" />
        </div>
        <div className="mt-3">
          <h3 className="font-heading text-base text-ink group-hover:text-mahogany transition-colors duration-200">
            {product.name}
          </h3>
          <p className="mt-1 font-body text-sm text-charcoal transition-colors duration-200 group-hover:text-zari-gold">
            Rs. {product.base_price.toLocaleString("en-PK")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
