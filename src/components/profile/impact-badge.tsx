import { cn } from "@/lib/utils";
import type { BadgeType } from "@/types/valorant";

const BADGE_CONFIG: Record<
  BadgeType,
  { label: string; color: string }
> = {
  match_mvp: { label: "MVP", color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
  team_mvp: { label: "Team MVP", color: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/15" },
  clutch_king: { label: "Clutch", color: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
  entry_fragger: { label: "Entry", color: "bg-red-500/10 text-red-400 border border-red-500/20" },
  headshot_machine: { label: "HS Machine", color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" },
  flawless: { label: "Flawless", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  ace: { label: "ACE", color: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
};

interface ImpactBadgeProps {
  type: BadgeType;
  className?: string;
}

export function ImpactBadge({ type, className }: ImpactBadgeProps) {
  const config = BADGE_CONFIG[type];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
