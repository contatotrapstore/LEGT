"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { ProfileData } from "@/types/valorant";
import {
  computePlayerStats,
  computeAgentStats,
  computeMapStats,
} from "@/lib/stats-calculator";
import { ModeTabs, type ProfileMode } from "./mode-tabs";
import { LastMatchOverlay } from "./last-match-overlay";
import { StatsSnapshot } from "./stats-snapshot";
import { AgentsSection } from "./agents-section";
import { MapStatsSection } from "./map-stats-section";
import { PerformanceTrends } from "./performance-trends";
import { RRChart } from "./rr-chart";
import { RecentMatches } from "./recent-matches";

interface ProfileContentProps {
  profile: ProfileData;
  region: string;
  riotId: string;
}

export function ProfileContent({ profile, region, riotId }: ProfileContentProps) {
  const [activeMode, setActiveMode] = useState<ProfileMode>("overview");
  const tStats = useTranslations("stats");
  const tMatches = useTranslations("matches");

  const modeCounts = useMemo(() => {
    const c: Record<string, number> = { all: profile.rawMatches.length };
    for (const m of profile.rawMatches) {
      const modeKey = m.meta.mode === "Competitive"
        ? "competitive"
        : m.meta.mode === "Unrated"
          ? "unrated"
          : m.meta.mode === "Deathmatch"
            ? "deathmatch"
            : m.meta.mode.toLowerCase();
      c[modeKey] = (c[modeKey] ?? 0) + 1;
    }
    return c;
  }, [profile.rawMatches]);

  const { stats, agentStats, mapStats, matches } = useMemo(() => {
    if (activeMode === "overview") {
      return {
        stats: profile.stats,
        agentStats: profile.agentStats,
        mapStats: profile.mapStats,
        matches: profile.recentMatches,
      };
    }

    // Filter raw matches by mode
    const modeMap: Record<string, string> = {
      competitive: "Competitive",
      unrated: "Unrated",
      deathmatch: "Deathmatch",
    };
    const targetMode = modeMap[activeMode];
    const filtered = profile.rawMatches.filter((m) => m.meta.mode === targetMode);

    return {
      stats: computePlayerStats(filtered),
      agentStats: computeAgentStats(filtered),
      mapStats: computeMapStats(filtered),
      matches: profile.recentMatches.filter((m) => m.mode === activeMode),
    };
  }, [activeMode, profile]);

  return (
    <div className="space-y-6">
      <ModeTabs
        activeMode={activeMode}
        onModeChange={setActiveMode}
        counts={modeCounts}
      />

      {activeMode === "overview" && profile.recentMatches.length > 0 && (
        <LastMatchOverlay
          match={profile.recentMatches[0]}
          region={region}
          puuid={profile.account.puuid}
        />
      )}

      {stats.matchesPlayed > 0 ? (
        <>
          <StatsSnapshot stats={stats} />
          <AgentsSection agents={agentStats} />
          {mapStats.length > 0 && <MapStatsSection maps={mapStats} />}
          <PerformanceTrends matches={matches} />
          {activeMode === "competitive" && profile.mmrHistory.length >= 3 && (
            <RRChart mmrHistory={profile.mmrHistory} />
          )}
        </>
      ) : (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-8 text-center backdrop-blur-sm">
          <p className="text-zinc-400">
            {tStats("noMatchData")}
          </p>
        </div>
      )}

      {matches.length > 0 ? (
        <RecentMatches
          matches={matches}
          region={region}
          riotId={riotId}
          puuid={profile.account.puuid}
        />
      ) : (
        stats.matchesPlayed === 0 && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-8 text-center backdrop-blur-sm">
            <p className="text-zinc-400">
              {tMatches("noMatches")}
            </p>
          </div>
        )
      )}
    </div>
  );
}
