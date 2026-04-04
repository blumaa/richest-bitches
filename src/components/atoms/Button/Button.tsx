import type { ReactNode } from "react";

const variantStyles = {
  primary:
    "bg-brand text-brand-foreground font-bold hover:bg-brand-hover",
  secondary:
    "bg-surface-raised border border-border text-secondary font-bold hover:text-primary",
  ghost:
    "border border-border text-muted hover:text-primary",
} as const;

const sizeStyles = {
  sm: "px-3 py-2.5 text-sm min-h-[44px]",
  md: "px-4 py-2 min-h-[44px]",
  lg: "px-6 py-3 min-h-[44px]",
} as const;

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  disabled?: boolean;
  type?: "button" | "submit";
  "aria-label"?: string;
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
