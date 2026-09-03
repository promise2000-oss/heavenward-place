"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, icon, iconPosition = "left", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5": variant === "primary",
            "bg-gradient-to-r from-secondary to-secondary-light text-white hover:shadow-lg hover:shadow-secondary/20 hover:-translate-y-0.5": variant === "secondary",
            "border-2 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5": variant === "outline",
            "text-charcoal hover:text-primary hover:bg-primary-lighter/30": variant === "ghost",
            "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/20": variant === "danger",
          },
          {
            "text-xs px-4 py-2.5": size === "sm",
            "text-sm px-6 py-3.5": size === "md",
            "text-base px-8 py-4": size === "lg",
          },
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon && iconPosition === "left" && icon
        )}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
