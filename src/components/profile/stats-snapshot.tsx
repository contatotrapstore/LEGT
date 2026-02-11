"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PlayerStats } from "@/types/valorant";
import { StatTile } from "./stat-tile";
import { formatNumber, formatPercent, formatKD } from "@/lib/utils";

interface StatsSnapshotProps {
  stats: PlayerStats;
}

export function StatsSnapshot({ stats }: StatsSnapshotProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("stats");

  const streakText =
    stats.currentStreak > 0
      ? t("wStreak", { count: stats.currentStreak })
      : stats.currentStreak < 0
        ? t("lStreak", { count: Math.abs(stats.currentStreak) })
        : t("noStreak");

  const streakTrend =
    stats.currentStreak > 0
      ? ("up" as const)
      : stats.currentStreak < 0
        ? ("down" as const)
        : ("neutral" as const);

  const primaryTiles = [
    {
      label: t("kd"),
      value: formatKD(stats.kills, stats.deaths),
      subValue: `${stats.kills}K / ${stats.deaths}D`,
      trend: stats.kd >= 1 ? ("up" as const) : ("down" as const),
    },
    {
      label: t("winRate"),
      value: formatPercent(stats.winRate),
      subValue: `${stats.wins}W ${stats.losses}L${stats.draws > 0 ? ` ${stats.draws}D` : ""}`,
      trend: stats.winRate >= 50 ? ("up" as const) : ("down" as const),
    },
    {
      label: t("acs"),
      value: String(stats.acs),
      subValue: t("avgCombatScore"),
    },
    {
      label: t("adr"),
      value: String(stats.adr),
      subValue: t("avgDamageRound"),
    },
    {
      label: t("hsPercent"),
      value: formatPercent(stats.hsPercent),
      subValue: t("headshot"),
      trend: stats.hsPercent >= 25 ? ("up" as const) : ("neutral" as const),
    },
    {
      label: t("avgKills"),
      value: formatNumber(stats.avgKillsPerMatch, 1),
      subValue: t("perMatch"),
    },
    {
      label: t("dmgDelta"),
      value: `${stats.damageDelta >= 0 ? "+" : ""}${stats.damageDelta}`,
      subValue: t("avgPerMatch"),
      trend: stats.damageDelta >= 0 ? ("up" as const) : ("down" as const),
    },
    {
      label: t("streak"),
      value: streakText,
      subValue: `${t("best")}: ${stats.longestWinStreak}W`,
      trend: streakTrend,
    },
  ];

  const expandedTiles = [
    {
      label: t("bodyPercent"),
      value: formatPercent(stats.bodyShotPercent),
      subValue: t("bodyshots"),
    },
    {
      label: t("legPercent"),
      value: formatPercent(stats.legShotPercent),
      subValue: t("legshots"),
    },
    {
      label: t("dmgMatch"),
      value: String(stats.damagePerMatch),
      subValue: t("avgDamageDealt"),
    },
    {
      label: t("scoreMatch"),
      value: String(stats.scorePerMatch),
      subValue: t("avgScore"),
    },
    {
      label: t("avgDeaths"),
      value: formatNumber(stats.avgDeathsPerMatch, 1),
      subValue: t("perMatch"),
    },
    {
      label: t("kda"),
      value: formatNumber(
        stats.deaths > 0
          ? (stats.kills + stats.assists) / stats.deaths
          : stats.kills + stats.assists,
        2
      ),
      subValue: `${stats.kills}/${stats.deaths}/${stats.assists}`,
    },
    {
      label: t("matches"),
      value: String(stats.matchesPlayed),
      subValue: t("totalGames"),
    },
    {
      label: t("assists"),
      value: formatNumber(stats.avgAssistsPerMatch, 1),
      subValue: t("avgPerMatch"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-red-500 rounded-full" />
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">
            {t("shotDistribution")}
          </span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          <motion.div
            className="bg-red-400 rounded-l-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.hsPercent}%` }}
            transition={{ duration: 0.8 }}
            title={`${t("head")}: ${formatPercent(stats.hsPercent)}`}
          />
          <motion.div
            className="bg-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${stats.bodyShotPercent}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
            title={`${t("body")}: ${formatPercent(stats.bodyShotPercent)}`}
          />
          <motion.div
            className="bg-zinc-500 rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${stats.legShotPercent}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            title={`${t("legs")}: ${formatPercent(stats.legShotPercent)}`}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px]">
          <span className="text-red-400">
            {t("head")} {formatPercent(stats.hsPercent)}
          </span>
          <span className="text-blue-400">
            {t("body")} {formatPercent(stats.bodyShotPercent)}
          </span>
          <span className="text-zinc-500">
            {t("legs")} {formatPercent(stats.legShotPercent)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:gap-4">
        {primaryTiles.map((tile, i) => (
          <StatTile key={tile.label} {...tile} delay={i * 0.05} />
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2 bg-white/[0.02] border border-white/[0.04] rounded-lg hover:bg-white/[0.04]"
      >
        {expanded ? t("showLess") : t("moreStats")}
        <span className="ml-1">{expanded ? "\u25B2" : "\u25BC"}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:gap-4">
              {expandedTiles.map((tile, i) => (
                <StatTile key={tile.label} {...tile} delay={i * 0.03} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
