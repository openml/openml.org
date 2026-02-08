"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endIcon?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, endIcon, id, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== "";

    return (
      <div className="space-y-1">
        <div className="group relative">
          <Input
            id={id}
            ref={ref}
            className={cn(
              "peer h-12 border-slate-300 bg-slate-50 px-3 pt-4 text-slate-800 transition-all duration-200 placeholder:text-transparent focus:border-slate-400 focus:ring-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-500",
              error ? "border-destructive focus-visible:ring-destructive" : "",
              className,
            )}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <Label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 transition-all duration-200 dark:text-slate-400",
              (isFocused || hasValue) &&
                "top-1.5 translate-y-0 text-[10px] font-semibold text-slate-600 dark:text-slate-300",
              !isFocused && !hasValue && "text-sm",
            )}
          >
            {label}
          </Label>
          {endIcon && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-destructive text-[11px] font-medium">{error}</p>
        )}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
