interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

const variantStyles: Record<string, string> = {
  default: "bg-charcoal text-kora",
  success: "bg-peacock text-kora",
  warning: "bg-zari-gold text-kora",
  info: "bg-mahogany text-kora",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs whitespace-nowrap",
        variantStyles[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
