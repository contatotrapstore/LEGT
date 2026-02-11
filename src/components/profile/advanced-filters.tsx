"use client";

import { useTranslations } from "next-intl";
import type { MatchSummary } from "@/types/valorant";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  matches: MatchSummary[];
  agentFilter: string | null;
  mapFilter: string | null;
  resultFilter: string | null;
  onAgentChange: (agent: string | null) => void;
  onMapChange: (map: string | null) => void;
  onResultChange: (result: string | null) => void;
}

export function AdvancedFilters({
  matches,
  agentFilter,
  mapFilter,
  resultFilter,
  onAgentChange,
  onMapChange,
  onResultChange,
}: AdvancedFiltersProps) {
  const t = useTranslations("filters");
  const tMatches = useTranslations("matches");

  // Unique agents and maps from current match set
  const agents = [...new Set(matches.map((m) => m.agent))].sort();
  const maps = [...new Set(matches.map((m) => m.map))].sort();
  const hasFilters = agentFilter || mapFilter || resultFilter;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {/* Result pills */}
          <FilterPill
            label={tMatches("win")}
            active={resultFilter === "win"}
            color="emerald"
            onClick={() => onResultChange(resultFilter === "win" ? null : "win")}
          />
          <FilterPill
            label={tMatches("loss")}
            active={resultFilter === "loss"}
            color="red"
            onClick={() => onResultChange(resultFilter === "loss" ? null : "loss")}
          />

          <span className="w-px h-5 bg-white/[0.06] mx-0.5" />

          {/* Agent pills */}
          {agents.map((agent) => (
            <FilterPill
              key={agent}
              label={agent}
              active={agentFilter === agent}
              onClick={() => onAgentChange(agentFilter === agent ? null : agent)}
            />
          ))}

          {maps.length > 1 && (
            <>
              <span className="w-px h-5 bg-white/[0.06] mx-0.5" />
              {maps.map((map) => (
                <FilterPill
                  key={map}
                  label={map}
                  active={mapFilter === map}
                  onClick={() => onMapChange(mapFilter === map ? null : map)}
                />
              ))}
            </>
          )}
        </div>

        {hasFilters && (
          <button
            onClick={() => {
              onAgentChange(null);
              onMapChange(null);
              onResultChange(null);
            }}
            className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors shrink-0 ml-2"
          >
            {t("clear")}
          </button>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: "emerald" | "red";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-1 rounded text-[11px] font-medium transition-all border",
        active
          ? color === "emerald"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : color === "red"
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-white/[0.08] text-white border-white/[0.15]"
          : "bg-white/[0.02] text-zinc-500 border-white/[0.04] hover:bg-white/[0.05] hover:text-zinc-300"
      )}
    >
      {label}
    </button>
  );
}
