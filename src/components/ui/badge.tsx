import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "win" | "loss" | "draw" | "rank" | "accent";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide",
        {
          "bg-white/[0.06] text-zinc-400": variant === "default",
          "bg-emerald-500/10 text-emerald-400": variant === "win",
          "bg-red-500/10 text-red-400": variant === "loss",
          "bg-yellow-500/10 text-yellow-400": variant === "draw",
          "bg-rank-primary/10 text-rank-primary": variant === "rank",
          "bg-red-500/10 text-red-400 border border-red-500/20": variant === "accent",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
