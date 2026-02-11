"use client";

import { motion } from "framer-motion";
import type { MatchPlayer } from "@/types/valorant";
import { formatPercent } from "@/lib/utils";

interface PlayerPerformanceProps {
  player: MatchPlayer;
}

export function PlayerPerformance({ player }: PlayerPerformanceProps) {
  const stats = player.stats;

  return (
    <motion.div
      className="bg-bg-card border border-border-subtle rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-sm font-medium text-text-muted mb-4">
        Your Performance
      </h3>

      {/* Big K/D/A */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-win">{stats.kills}</div>
          <div className="text-xs text-text-muted">Kills</div>
        </div>
        <span className="text-2xl text-text-muted">/</span>
        <div className="text-center">
          <div className="text-3xl font-bold text-loss">{stats.deaths}</div>
          <div className="text-xs text-text-muted">Deaths</div>
        </div>
        <span className="text-2xl text-text-muted">/</span>
        <div className="text-center">
          <div className="text-3xl font-bold text-text-secondary">
            {stats.assists}
          </div>
          <div className="text-xs text-text-muted">Assists</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <StatBlock label="ACS" value={String(stats.acs)} />
        <StatBlock label="ADR" value={String(stats.adr)} />
        <StatBlock label="HS%" value={formatPercent(stats.hsPercent)} />
        <StatBlock
          label="K/D"
          value={
            stats.deaths > 0
              ? (stats.kills / stats.deaths).toFixed(2)
              : stats.kills.toFixed(1)
          }
        />
      </div>
    </motion.div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}
