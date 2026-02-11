"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MatchSummary, MatchDetail } from "@/types/valorant";
import { cn, formatPercent } from "@/lib/utils";
import { MatchScoreboard } from "./match-scoreboard";

interface MatchDetailPanelProps {
  match: MatchSummary;
  region: string;
  puuid: string;
}

export function MatchDetailPanel({ match, region, puuid }: MatchDetailPanelProps) {
  const t = useTranslations("matches");
  const [scoreboardState, setScoreboardState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMatchDetail() {
      try {
        const res = await fetch(
          `/api/match/${encodeURIComponent(match.matchId)}?puuid=${encodeURIComponent(puuid)}`
        );
        if (!res.ok) {
          if (!cancelled) setScoreboardState("error");
          return;
        }
        const json = await res.json();
        if (!cancelled && json.data) {
          setMatchDetail(json.data);
          setScoreboardState("loaded");
        } else if (!cancelled) {
          setScoreboardState("error");
        }
      } catch {
        if (!cancelled) setScoreboardState("error");
      }
    }

    fetchMatchDetail();
    return () => { cancelled = true; };
  }, [match.matchId, puuid]);

  const totalShots = match.shots.head + match.shots.body + match.shots.leg;
  const headPct = totalShots > 0 ? (match.shots.head / totalShots) * 100 : 0;
  const bodyPct = totalShots > 0 ? (match.shots.body / totalShots) * 100 : 0;
  const legPct = totalShots > 0 ? (match.shots.leg / totalShots) * 100 : 0;
  const damageDelta = match.damageMade - match.damageReceived;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="border-t border-white/[0.06] px-3 sm:px-4 py-3 space-y-3">
        {/* Scoreboard */}
        {scoreboardState === "loading" && <ScoreboardSkeleton />}
        {scoreboardState === "loaded" && matchDetail && (
          <MatchScoreboard detail={matchDetail} observedPuuid={puuid} />
        )}

        {/* Shot Distribution */}
        <div className="space-y-1.5">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
            {t("shotBreakdown")}
          </p>
          <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.05]">
            {headPct > 0 && (
              <div
                className="bg-cyan-500 transition-all"
                style={{ width: `${headPct}%` }}
              />
            )}
            {bodyPct > 0 && (
              <div
                className="bg-zinc-500 transition-all"
                style={{ width: `${bodyPct}%` }}
              />
            )}
            {legPct > 0 && (
              <div
                className="bg-orange-500 transition-all"
                style={{ width: `${legPct}%` }}
              />
            )}
          </div>
          <div className="flex gap-4 text-[11px]">
            <span className="text-cyan-400">
              {t("head")} {formatPercent(headPct)}
            </span>
            <span className="text-zinc-400">
              {t("body")} {formatPercent(bodyPct)}
            </span>
            <span className="text-orange-400">
              {t("legs")} {formatPercent(legPct)}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCell label={t("damageMade")} value={match.damageMade.toLocaleString()} />
          <StatCell label={t("damageReceived")} value={match.damageReceived.toLocaleString()} />
          <StatCell
            label={t("damageDelta")}
            value={`${damageDelta >= 0 ? "+" : ""}${damageDelta.toLocaleString()}`}
            color={damageDelta >= 0 ? "text-emerald-400" : "text-red-400"}
          />
          <StatCell label={t("roundsPlayed")} value={String(match.roundsPlayed)} />
        </div>

        {/* Rank at match time */}
        {match.tier >= 3 && (
          <div className="flex items-center gap-2 pt-1">
            <Image
              src={match.tierIcon}
              alt={match.tierName}
              width={20}
              height={20}
              unoptimized
            />
            <span className="text-xs text-zinc-400">
              {t("rank")}: <span className="text-white font-medium">{match.tierName}</span>
              {match.rrAfter !== null && (
                <span className="text-zinc-500 ml-1">({match.rrAfter} RR)</span>
              )}
            </span>
          </div>
        )}

        {/* API limitation note - only show when scoreboard failed */}
        {scoreboardState === "error" && (
          <div className="flex items-center gap-2 pt-1 px-1">
            <svg className="w-3.5 h-3.5 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              {t("scoreboardUnavailable")}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ScoreboardSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="bg-white/[0.03] rounded-lg h-[120px]" />
      <div className="bg-white/[0.03] rounded-lg h-[120px]" />
    </div>
  );
}

function StatCell({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-md px-3 py-2">
      <div className={cn("text-sm font-bold", color || "text-white")}>{value}</div>
      <div className="text-[10px] text-zinc-600 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
