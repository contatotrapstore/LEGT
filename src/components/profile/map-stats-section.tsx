"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { MapStats } from "@/types/valorant";
import { MAP_IMAGES } from "@/lib/constants";
import { formatNumber, formatPercent } from "@/lib/utils";

interface MapStatsSectionProps {
  maps: MapStats[];
}

export function MapStatsSection({ maps }: MapStatsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations("maps");
  const tCommon = useTranslations("common");

  if (maps.length === 0) return null;

  const sortedMaps = [...maps].sort((a, b) => b.matchesPlayed - a.matchesPlayed);
  const visible = showAll ? sortedMaps : sortedMaps.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-red-500 rounded-full" />
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {visible.map((map, i) => {
            const splashUrl = MAP_IMAGES[map.mapName];

            return (
              <motion.div
                key={map.mapName}
                layout
                className="relative bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                {/* Background splash image */}
                {splashUrl && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: `url(${splashUrl})` }}
                  />
                )}

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-white text-sm">
                      {map.mapName}
                    </span>
                    <span className="text-[10px] text-zinc-600 bg-white/[0.04] px-1.5 py-0.5 rounded">
                      {map.matchesPlayed} {tCommon("games")}
                    </span>
                  </div>

                  {/* Win rate bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
                        {t("winRate")}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {formatPercent(map.winRate)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            map.winRate >= 50
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : "linear-gradient(90deg, #ef4444, #f87171)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(map.winRate, 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 + 0.2 }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-center">
                      <div className="font-bold text-emerald-400">{map.wins}W</div>
                      <div className="text-[10px] text-zinc-600">
                        {map.losses}L
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white">
                        {formatNumber(map.kd, 2)}
                      </div>
                      <div className="text-[10px] text-zinc-600">{t("kd")}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white">
                        {map.adr}
                      </div>
                      <div className="text-[10px] text-zinc-600">{t("adr")}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white">{map.avgAcs}</div>
                      <div className="text-[10px] text-zinc-600">ACS</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {sortedMaps.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2 bg-white/[0.02] border border-white/[0.04] rounded-lg hover:bg-white/[0.04]"
        >
          {showAll ? t("showLess") : t("showAll")}
          <span className="ml-1">{showAll ? "\u25B2" : "\u25BC"}</span>
        </button>
      )}
    </div>
  );
}
