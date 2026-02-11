import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  color?: "rank" | "red" | "green";
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
  color = "rank",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  const barColor = {
    rank: "bg-rank-primary",
    red: "bg-red-500",
    green: "bg-emerald-500",
  }[color];

  return (
    <div className={cn("relative", className)}>
      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs text-zinc-500">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
