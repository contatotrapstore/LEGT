"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type ProfileMode = "overview" | "competitive" | "unrated" | "deathmatch";

const MODES: ProfileMode[] = ["overview", "competitive", "unrated", "deathmatch"];

interface ModeTabsProps {
  activeMode: ProfileMode;
  onModeChange: (mode: ProfileMode) => void;
  counts: Record<string, number>;
}

export function ModeTabs({ activeMode, onModeChange, counts }: ModeTabsProps) {
  const t = useTranslations("modes");
  const tProfile = useTranslations("profile");

  return (
    <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-lg backdrop-blur-sm">
      {MODES.map((mode) => {
        const isActive = activeMode === mode;
        const count = mode === "overview" ? counts.all : (counts[mode] ?? 0);

        if (mode !== "overview" && count === 0) return null;

        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={cn(
              "relative flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors",
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white/[0.08] border border-white/[0.10] rounded-md"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {mode === "overview" ? tProfile("overview") : t(mode)}
              {count > 0 && (
                <span className={cn(
                  "text-[10px]",
                  isActive ? "text-zinc-400" : "text-zinc-600"
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
