"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 rounded-xl border border-border bg-white text-ink text-sm",
              "placeholder:text-charcoal/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-all duration-200",
              {!!icon && "pl-10"},
              {!!error && "border-error focus:ring-error/20 focus:border-error"},
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
