"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MatchSummary, MatchDetail } from "@/types/valorant";
import { cn, formatDate } from "@/lib/utils";
import { MAP_IMAGES } from "@/lib/constants";
import { MatchScoreboard } from "./match-scoreboard";

interface LastMatchOverlayProps {
  match: MatchSummary;
  region: string;
  puuid: string;
}

export function LastMatchOverlay({ match, region, puuid }: LastMatchOverlayProps) {
  const t = useTranslations("matches");
  const tModes = useTranslations("modes");
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const [detail, setDetail] = useState<MatchDetail | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      try {
        const res = await fetch(
          `/api/match/${encodeURIComponent(match.matchId)}?puuid=${encodeURIComponent(puuid)}&region=${encodeURIComponent(region)}`
        );
        if (!res.ok) {
          if (!cancelled) setState("error");
          return;
        }
        const json = await res.json();
        if (!cancelled && json.data) {
          setDetail(json.data);
          setState("loaded");
        } else if (!cancelled) {
          setState("error");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    fetchDetail();
    return () => { cancelled = true; };
  }, [match.matchId, puuid, region]);

  const mapImage = MAP_IMAGES[match.map];
  const resultLabel = t(match.result);
  const resultColor = {
    win: "text-emerald-400",
    loss: "text-red-400",
    draw: "text-yellow-400",
  }[match.result];
  const resultBorder = {
    win: "border-emerald-500/30",
    loss: "border-red-500/30",
    draw: "border-yellow-500/30",
  }[match.result];

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border",
      resultBorder,
      "bg-white/[0.02] backdrop-blur-sm"
    )}>
      {/* Map Background */}
      {mapImage && (
        <div className="absolute inset-0">
          <Image
            src={mapImage}
            alt={match.map}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/90 to-black/95" />
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 sm:px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-red-500 rounded-full" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                {t("lastMatch")}
              </h3>
            </div>
            <span className="text-[11px] text-zinc-500">
              {formatDate(match.playedAt)}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Agent Icon */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-white/[0.05] shrink-0">
              {match.agentIcon ? (
                <Image
                  src={match.agentIcon}
                  alt={match.agent}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-lg font-bold">
                  {match.agent.charAt(0)}
                </div>
              )}
            </div>

            {/* Match Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-base sm:text-lg">
                  {match.map}
                </span>
                <span className="text-[11px] text-zinc-400 bg-white/[0.06] px-2 py-0.5 rounded">
                  {tModes(match.mode as "competitive" | "unrated" | "deathmatch" | "teamdeathmatch" | "spikerush" | "swiftplay" | "escalation" | "replication" | "premier" | "custom" | "unknown")}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("text-sm font-bold", resultColor)}>
                  {resultLabel}
                </span>
                <span className="text-sm text-zinc-300 font-medium">
                  {match.score.team}-{match.score.enemy}
                </span>
                {match.rrChange !== null && (
                  <span className={cn(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded",
                    match.rrChange > 0 ? "bg-emerald-500/10 text-emerald-400" :
                    match.rrChange < 0 ? "bg-red-500/10 text-red-400" :
                    "bg-zinc-500/10 text-zinc-400"
                  )}>
                    {match.rrChange > 0 ? "+" : ""}{match.rrChange} RR
                  </span>
                )}
              </div>
            </div>

            {/* Player Stats */}
            <div className="hidden sm:flex items-center gap-5 text-sm">
              <div className="text-center">
                <div className="font-bold text-white text-base">
                  {match.kills}/{match.deaths}/{match.assists}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">K/D/A</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-base">{match.acs}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">ACS</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-base">{match.adr}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">ADR</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="px-3 sm:px-4 pb-4">
          {state === "loading" && <OverlaySkeleton />}
          {state === "loaded" && detail && (
            <MatchScoreboard detail={detail} observedPuuid={puuid} region={region} />
          )}
          {state === "error" && (
            <div className="text-center py-4">
              <p className="text-[11px] text-zinc-600">{t("scoreboardUnavailable")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OverlaySkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="bg-white/[0.03] rounded-lg h-[130px]" />
      <div className="bg-white/[0.03] rounded-lg h-[130px]" />
    </div>
  );
}
