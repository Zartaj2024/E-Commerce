interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}

const variantStyles: Record<string, string> = {
  default: "bg-charcoal text-kora shadow-sm shadow-charcoal/20",
  success: "bg-peacock text-kora shadow-sm shadow-peacock/20",
  warning: "bg-zari-gold text-kora shadow-sm shadow-zari-gold/20",
  info: "bg-mahogany text-kora shadow-sm shadow-mahogany/20",
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
