"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { MMRHistoryEntry } from "@/types/valorant";
import { Sparkline } from "@/components/ui/sparkline";

interface RRChartProps {
  mmrHistory: MMRHistoryEntry[];
}

export function RRChart({ mmrHistory }: RRChartProps) {
  const t = useTranslations("trends");

  if (mmrHistory.length < 3) return null;

  // Reverse for chronological order (oldest first)
  const entries = [...mmrHistory].reverse().slice(-20);
  const eloData = entries.map((e) => e.elo);
  const dotColors = entries.map((e) =>
    e.mmr_change_to_last_game > 0
      ? "#10b981"
      : e.mmr_change_to_last_game < 0
        ? "#ef4444"
        : "#71717a"
  );

  const currentRR = entries[entries.length - 1].ranking_in_tier;
  const currentRank = entries[entries.length - 1].currenttierpatched;
  const netRR = entries.reduce((acc, e) => acc + e.mmr_change_to_last_game, 0);

  return (
    <motion.div
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
          {t("rrProgression")}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{currentRank}</span>
          <span className="text-xs font-bold text-white">{currentRR} RR</span>
        </div>
      </div>

      <Sparkline
        data={eloData}
        width={480}
        height={60}
        color="#ef4444"
        showDots
        dotColors={dotColors}
      />

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-zinc-600">
          {t("last", { count: entries.length })}
        </span>
        <span
          className={`text-[11px] font-bold ${netRR >= 0 ? "text-emerald-400" : "text-red-400"}`}
        >
          {netRR >= 0 ? "+" : ""}{netRR} RR {t("net")}
        </span>
      </div>
    </motion.div>
  );
}
