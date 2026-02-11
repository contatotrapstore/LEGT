import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white/[0.03] border border-white/[0.06] p-4",
        "backdrop-blur-sm transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
