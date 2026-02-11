import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-2.5",
          "text-white placeholder:text-zinc-500",
          "focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50",
          "backdrop-blur-sm transition-all duration-200",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
