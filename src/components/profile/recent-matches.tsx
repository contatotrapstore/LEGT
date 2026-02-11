"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { MatchSummary } from "@/types/valorant";
import { MatchCard } from "./match-card";
import { AdvancedFilters } from "./advanced-filters";

interface RecentMatchesProps {
  matches: MatchSummary[];
  region: string;
  riotId: string;
  puuid: string;
}

export function RecentMatches({ matches, region, puuid }: RecentMatchesProps) {
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const [mapFilter, setMapFilter] = useState<string | null>(null);
  const [resultFilter, setResultFilter] = useState<string | null>(null);
  const t = useTranslations("matches");
  const tCommon = useTranslations("common");

  const filtered = useMemo(() => {
    let result = matches;
    if (agentFilter) result = result.filter((m) => m.agent === agentFilter);
    if (mapFilter) result = result.filter((m) => m.map === mapFilter);
    if (resultFilter) result = result.filter((m) => m.result === resultFilter);
    return result;
  }, [matches, agentFilter, mapFilter, resultFilter]);

  if (matches.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
        </div>
        <span className="text-xs text-zinc-500 bg-white/[0.04] px-2 py-1 rounded">
          {filtered.length} {tCommon("games")}
        </span>
      </div>

      <AdvancedFilters
        matches={matches}
        agentFilter={agentFilter}
        mapFilter={mapFilter}
        resultFilter={resultFilter}
        onAgentChange={setAgentFilter}
        onMapChange={setMapFilter}
        onResultChange={setResultFilter}
      />

      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((match, i) => (
            <MatchCard key={match.matchId} match={match} delay={i * 0.05} region={region} puuid={puuid} />
          ))
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-6 text-center backdrop-blur-sm">
            <p className="text-zinc-500 text-sm">
              {t("noMatchesForMode")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
