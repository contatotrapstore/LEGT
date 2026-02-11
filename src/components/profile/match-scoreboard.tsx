"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { MatchDetail, MatchPlayer } from "@/types/valorant";
import { cn, formatPercent, buildProfileUrl } from "@/lib/utils";
import { buildRankInfo } from "@/lib/rank-utils";

interface MatchScoreboardProps {
  detail: MatchDetail;
  observedPuuid: string;
  region: string;
}

// Assign party colors
const PARTY_COLORS = [
  "bg-cyan-400",
  "bg-amber-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-rose-400",
];

function getPartyColorMap(players: MatchPlayer[]): Map<string, string> {
  const partyCount = new Map<string, number>();
  for (const p of players) {
    if (p.partyId) {
      partyCount.set(p.partyId, (partyCount.get(p.partyId) || 0) + 1);
    }
  }
  // Only assign colors to parties with 2+ members
  const colorMap = new Map<string, string>();
  let colorIdx = 0;
  for (const [partyId, count] of partyCount) {
    if (count >= 2) {
      colorMap.set(partyId, PARTY_COLORS[colorIdx % PARTY_COLORS.length]);
      colorIdx++;
    }
  }
  return colorMap;
}

function computeAverageRank(players: MatchPlayer[]): { avgTier: number; rankInfo: ReturnType<typeof buildRankInfo> } | null {
  const rankedPlayers = players.filter((p) => p.rank >= 3);
  if (rankedPlayers.length === 0) return null;
  const avgTier = Math.round(rankedPlayers.reduce((sum, p) => sum + p.rank, 0) / rankedPlayers.length);
  return { avgTier, rankInfo: buildRankInfo(avgTier) };
}

export function MatchScoreboard({ detail, observedPuuid, region }: MatchScoreboardProps) {
  const t = useTranslations("matches");

  // Determine which team the observed player is on
  const observedTeam = detail.teams.blue.some((p) => p.puuid === observedPuuid)
    ? "blue"
    : "red";
  const yourTeam = observedTeam === "blue" ? detail.teams.blue : detail.teams.red;
  const enemyTeam = observedTeam === "blue" ? detail.teams.red : detail.teams.blue;
  const yourScore = observedTeam === "blue" ? detail.score.blue : detail.score.red;
  const enemyScore = observedTeam === "blue" ? detail.score.red : detail.score.blue;

  const allPlayers = [...detail.teams.blue, ...detail.teams.red];
  const partyColors = getPartyColorMap(allPlayers);

  return (
    <div className="space-y-3">
      <TeamTable
        label={t("yourTeam")}
        score={yourScore}
        players={yourTeam}
        partyColors={partyColors}
        isWinning={yourScore > enemyScore}
        region={region}
        t={t}
      />
      <TeamTable
        label={t("enemyTeam")}
        score={enemyScore}
        players={enemyTeam}
        partyColors={partyColors}
        isWinning={enemyScore > yourScore}
        region={region}
        t={t}
      />
    </div>
  );
}

function TeamTable({
  label,
  score,
  players,
  partyColors,
  isWinning,
  region,
  t,
}: {
  label: string;
  score: number;
  players: MatchPlayer[];
  partyColors: Map<string, string>;
  isWinning: boolean;
  region: string;
  t: ReturnType<typeof useTranslations<"matches">>;
}) {
  const avgRank = computeAverageRank(players);

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
      {/* Team Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            {label}
          </span>
          {avgRank && (
            <div className="flex items-center gap-1.5 bg-white/[0.04] rounded px-2 py-0.5">
              {avgRank.rankInfo.iconUrl && (
                <Image
                  src={avgRank.rankInfo.iconUrl}
                  alt={avgRank.rankInfo.tierName}
                  width={14}
                  height={14}
                  unoptimized
                />
              )}
              <span className="text-[10px] text-zinc-400">
                {t("avgRank")}: <span className="text-zinc-200 font-medium">{avgRank.rankInfo.tierName}</span>
              </span>
            </div>
          )}
        </div>
        <span
          className={cn(
            "text-sm font-bold",
            isWinning ? "text-emerald-400" : "text-red-400"
          )}
        >
          {score}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-zinc-600 uppercase tracking-wider">
              <th className="text-left pl-3 pr-1 py-1.5 font-medium w-[180px] min-w-[140px]">
                {t("player")}
              </th>
              <th className="text-center px-1 py-1.5 font-medium w-[60px]">
                {t("rank")}
              </th>
              <th className="text-center px-1 py-1.5 font-medium">ACS</th>
              <th className="text-center px-1 py-1.5 font-medium">K</th>
              <th className="text-center px-1 py-1.5 font-medium">D</th>
              <th className="text-center px-1 py-1.5 font-medium">A</th>
              <th className="text-center px-1 py-1.5 font-medium">+/-</th>
              <th className="text-center px-1 py-1.5 font-medium">ADR</th>
              <th className="text-center px-1 py-1.5 font-medium">HS%</th>
              <th className="text-center px-1 pr-3 py-1.5 font-medium">DMG</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <PlayerRow
                key={player.puuid}
                player={player}
                partyColor={partyColors.get(player.partyId)}
                region={region}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlayerRow({
  player,
  partyColor,
  region,
}: {
  player: MatchPlayer;
  partyColor?: string;
  region: string;
}) {
  const kdDiff = player.stats.kills - player.stats.deaths;
  const rankInfo = buildRankInfo(player.rank);
  const profileUrl = buildProfileUrl(region, player.name, player.tag);

  return (
    <tr
      className={cn(
        "border-t border-white/[0.04] hover:bg-white/[0.03] transition-colors",
        player.isObserved && "bg-white/[0.06]"
      )}
    >
      {/* Player (Agent + Name) */}
      <td className="pl-3 pr-1 py-1.5">
        <div className="flex items-center gap-2">
          {/* Party dot */}
          <div className="w-1 shrink-0">
            {partyColor && (
              <div className={cn("w-1 h-1 rounded-full", partyColor)} />
            )}
          </div>
          {/* Agent icon */}
          <div className="relative w-6 h-6 rounded shrink-0 overflow-hidden bg-white/[0.05]">
            {player.agentIcon ? (
              <Image
                src={player.agentIcon}
                alt={player.agent}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-500">
                {player.agent.charAt(0)}
              </div>
            )}
          </div>
          {/* Name - clickable link to profile */}
          <a
            href={profileUrl}
            className={cn(
              "truncate max-w-[100px] hover:underline transition-colors",
              player.isObserved
                ? "text-white font-semibold hover:text-red-300"
                : "text-zinc-300 hover:text-white"
            )}
            title={`${player.name}#${player.tag}`}
          >
            {player.name}
          </a>
        </div>
      </td>

      {/* Rank */}
      <td className="text-center px-1 py-1.5">
        <div className="flex items-center justify-center gap-1">
          {rankInfo.iconUrl ? (
            <Image
              src={rankInfo.iconUrl}
              alt={rankInfo.tierName}
              width={16}
              height={16}
              unoptimized
              title={rankInfo.tierName}
            />
          ) : (
            <span className="text-[9px] text-zinc-600">-</span>
          )}
        </div>
      </td>

      {/* ACS */}
      <td className="text-center px-1 py-1.5">
        <span className={cn("font-medium", player.isObserved ? "text-white" : "text-zinc-300")}>
          {player.stats.acs}
        </span>
      </td>

      {/* K */}
      <td className="text-center px-1 py-1.5 text-zinc-300">{player.stats.kills}</td>

      {/* D */}
      <td className="text-center px-1 py-1.5 text-zinc-300">{player.stats.deaths}</td>

      {/* A */}
      <td className="text-center px-1 py-1.5 text-zinc-300">{player.stats.assists}</td>

      {/* +/- */}
      <td className="text-center px-1 py-1.5">
        <span
          className={cn(
            "font-medium",
            kdDiff > 0 ? "text-emerald-400" : kdDiff < 0 ? "text-red-400" : "text-zinc-500"
          )}
        >
          {kdDiff > 0 ? "+" : ""}
          {kdDiff}
        </span>
      </td>

      {/* ADR */}
      <td className="text-center px-1 py-1.5 text-zinc-300">{player.stats.adr}</td>

      {/* HS% */}
      <td className="text-center px-1 py-1.5 text-zinc-300">
        {formatPercent(player.stats.hsPercent)}
      </td>

      {/* DMG */}
      <td className="text-center px-1 pr-3 py-1.5 text-zinc-400">
        {player.damageMade.toLocaleString()}
      </td>
    </tr>
  );
}
