"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FILTER_MODES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MatchFilterProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
  counts: Record<string, number>;
}

export function MatchFilter({
  activeMode,
  onModeChange,
  counts,
}: MatchFilterProps) {
  const t = useTranslations("modes");

  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_MODES.map((mode) => {
        const isActive = activeMode === mode.value;
        const count = mode.value === "all" ? counts.all : (counts[mode.value] ?? 0);

        if (mode.value !== "all" && count === 0) return null;

        return (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={cn(
              "relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
              "border backdrop-blur-sm",
              isActive
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-red-500/10 border border-red-500/20 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">
              {t(mode.value)}
              {count > 0 && (
                <span className={cn(
                  "ml-1.5 text-[10px]",
                  isActive ? "text-red-400/70" : "text-zinc-600"
                )}>
                  {count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
