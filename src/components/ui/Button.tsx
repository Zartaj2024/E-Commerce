import { type ButtonHTMLAttributes, forwardRef } from "react";
import { motion, useReducedMotion } from "motion/react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-mahogany text-kora hover:shadow-lg hover:shadow-mahogany/20 active:bg-mahogany/90",
  secondary:
    "bg-transparent text-ink border border-charcoal/30 hover:bg-charcoal/5 active:bg-charcoal/10",
  ghost:
    "bg-transparent text-peacock hover:underline active:opacity-80",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) {
    const reduce = useReducedMotion();

    return (
      <motion.div
        whileHover={reduce || disabled ? undefined : { scale: 1.02 }}
        whileTap={reduce || disabled ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="inline-flex"
      >
        <button
          ref={ref}
          disabled={disabled}
          className={[
            "inline-flex items-center justify-center rounded px-5 py-3 font-body text-sm transition-all duration-200",
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
      </motion.div>
    );
  }
);
