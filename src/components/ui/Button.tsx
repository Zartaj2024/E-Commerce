import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-mahogany text-kora hover:opacity-90 active:opacity-80",
  secondary:
    "bg-transparent text-ink border border-charcoal/30 hover:bg-charcoal/5 active:bg-charcoal/10",
  ghost:
    "bg-transparent text-peacock hover:underline active:opacity-80",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", fullWidth = false, className = "", disabled, children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          "inline-flex items-center justify-center rounded px-5 py-3 font-body text-sm transition-opacity",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peacock",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);
