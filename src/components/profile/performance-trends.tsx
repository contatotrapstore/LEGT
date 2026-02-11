"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { MatchSummary } from "@/types/valorant";
import { Sparkline } from "@/components/ui/sparkline";
import { cn } from "@/lib/utils";

interface PerformanceTrendsProps {
  matches: MatchSummary[];
}

export function PerformanceTrends({ matches }: PerformanceTrendsProps) {
  const t = useTranslations("trends");

  if (matches.length < 3) return null;

  // Recent matches in chronological order (oldest first for chart)
  const recent = [...matches].reverse().slice(-15);

  const kdData = recent.map((m) =>
    m.deaths > 0 ? m.kills / m.deaths : m.kills
  );
  const acsData = recent.map((m) => m.acs);
  const adrData = recent.map((m) => m.adr);

  const currentKD = kdData[kdData.length - 1];
  const currentACS = acsData[acsData.length - 1];
  const currentADR = adrData[adrData.length - 1];

  const avgKD = kdData.reduce((a, b) => a + b, 0) / kdData.length;
  const avgACS = Math.round(acsData.reduce((a, b) => a + b, 0) / acsData.length);
  const avgADR = Math.round(adrData.reduce((a, b) => a + b, 0) / adrData.length);

  const trends = [
    {
      label: t("kdTrend"),
      data: kdData,
      current: currentKD.toFixed(2),
      avg: avgKD.toFixed(2),
      color: "#ef4444",
      isUp: currentKD >= avgKD,
    },
    {
      label: t("acsTrend"),
      data: acsData,
      current: String(currentACS),
      avg: String(avgACS),
      color: "#3b82f6",
      isUp: currentACS >= avgACS,
    },
    {
      label: t("adrTrend"),
      data: adrData,
      current: String(currentADR),
      avg: String(avgADR),
      color: "#8b5cf6",
      isUp: currentADR >= avgADR,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-red-500 rounded-full" />
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {trends.map((trend, i) => (
          <motion.div
            key={trend.label}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
                {trend.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold",
                  trend.isUp ? "text-emerald-400" : "text-red-400"
                )}
              >
                {trend.isUp ? "\u2191" : "\u2193"}
              </span>
            </div>
            <div className="flex items-end justify-between mb-3">
              <span className="text-xl font-bold text-white">{trend.current}</span>
              <span className="text-[11px] text-zinc-600">
                {t("avg")}: {trend.avg}
              </span>
            </div>
            <Sparkline
              data={trend.data}
              width={200}
              height={36}
              color={trend.color}
            />
            <p className="text-[10px] text-zinc-600 mt-1.5">
              {t("last", { count: recent.length })}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
