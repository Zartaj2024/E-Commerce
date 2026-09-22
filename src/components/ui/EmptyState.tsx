"use client";

import { motion, useReducedMotion } from "motion/react";

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  message,
  action,
}: EmptyStateProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <p className="font-heading text-lg text-ink">{title}</p>
      <p className="mt-2 max-w-sm font-body text-sm text-charcoal">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
