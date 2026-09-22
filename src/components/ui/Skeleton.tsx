"use client";

import { useReducedMotion } from "motion/react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const reduce = useReducedMotion();

  const baseClasses = "rounded bg-charcoal/10";
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  const style: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      className={[baseClasses, variantClasses[variant], reduce ? "" : "skeleton-shimmer", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      aria-hidden="true"
    />
  );
}
