"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MatchSummary } from "@/types/valorant";
import { ImpactBadge } from "./impact-badge";
import { MatchDetailPanel } from "./match-detail-panel";
import { cn, formatDate, formatPercent } from "@/lib/utils";

interface MatchCardProps {
  match: MatchSummary;
  delay?: number;
  region: string;
  puuid: string;
}

export function MatchCard({
  match,
  delay = 0,
  region,
  puuid,
}: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("matches");
  const tModes = useTranslations("modes");

  const resultColor = {
    win: "border-l-emerald-500",
    loss: "border-l-red-500",
    draw: "border-l-yellow-500",
  }[match.result];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div
        className={cn(
          "bg-white/[0.02] border border-white/[0.06] rounded-lg",
          "border-l-[3px] backdrop-blur-sm",
          "hover:bg-white/[0.04] transition-all duration-200",
          resultColor
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full p-3 sm:p-4 text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-white/[0.05]">
                {match.agentIcon ? (
                  <Image
                    src={match.agentIcon}
                    alt={match.agent}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm font-bold">
                    {match.agent.charAt(0)}
                  </div>
                )}
              </div>
              {match.tierIcon && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5">
                  <Image
                    src={match.tierIcon}
                    alt={match.tierName}
                    width={20}
                    height={20}
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm truncate">
                  {match.map}
                </span>
                <span className="text-[11px] text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded">
                  {tModes(match.mode as "competitive" | "unrated" | "deathmatch" | "spikerush" | "swiftplay" | "escalation" | "replication" | "premier" | "custom" | "unknown")}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={cn("text-xs font-bold", {
                    "text-emerald-400": match.result === "win",
                    "text-red-400": match.result === "loss",
                    "text-yellow-400": match.result === "draw",
                  })}
                >
                  {t(match.result)}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {match.score.team}-{match.score.enemy}
                </span>
                {match.rrChange !== null && (
                  <span
                    className={cn("text-[11px] font-bold px-1.5 py-0.5 rounded", {
                      "bg-emerald-500/10 text-emerald-400": match.rrChange > 0,
                      "bg-red-500/10 text-red-400": match.rrChange < 0,
                      "bg-zinc-500/10 text-zinc-400": match.rrChange === 0,
                    })}
                  >
                    {match.rrChange > 0 ? "+" : ""}{match.rrChange} RR
                  </span>
                )}
                <span className="text-[11px] text-zinc-600">
                  {formatDate(match.playedAt)}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-5 text-sm">
              <div className="text-center min-w-[60px]">
                <div className="font-bold text-white">
                  {match.kills}/{match.deaths}/{match.assists}
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider">K/D/A</div>
              </div>
              <div className="text-center min-w-[36px]">
                <div className="font-bold text-white">
                  {match.acs}
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider">ACS</div>
              </div>
              <div className="text-center min-w-[36px]">
                <div className="font-bold text-white">
                  {match.adr}
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider">ADR</div>
              </div>
              <div className="text-center min-w-[40px]">
                <div className="font-bold text-white">
                  {formatPercent(match.hsPercent)}
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wider">HS%</div>
              </div>
            </div>

            {match.badges.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1">
                {match.badges.slice(0, 2).map((badge) => (
                  <ImpactBadge key={badge} type={badge} />
                ))}
              </div>
            )}

            <div className="sm:hidden text-right text-xs">
              <div className="font-bold text-white">
                {match.kills}/{match.deaths}/{match.assists}
              </div>
              <div className="text-zinc-500">{match.acs} ACS</div>
            </div>

            <svg
              className={cn(
                "w-4 h-4 text-zinc-600 shrink-0 transition-transform duration-200",
                expanded && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {expanded && <MatchDetailPanel match={match} region={region} puuid={puuid} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
