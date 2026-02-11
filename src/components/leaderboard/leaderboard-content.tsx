"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { REGIONS } from "@/lib/constants";
import { buildRankInfo } from "@/lib/rank-utils";
import { buildProfileUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { HenrikLeaderboardPlayer } from "@/types/api";

export function LeaderboardContent() {
  const [region, setRegion] = useState("eu");
  const [players, setPlayers] = useState<HenrikLeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const t = useTranslations("leaderboard");
  const tRegions = useTranslations("regions");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(`/api/leaderboard/${region}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) {
          setError(json.error);
          setPlayers([]);
        } else {
          setPlayers(json.data?.players ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setError(t("error"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [region, t]);

  const handlePlayerClick = (player: HenrikLeaderboardPlayer) => {
    if (player.is_anonymized || !player.name || !player.tag) return;
    router.push(buildProfileUrl(region, player.name, player.tag));
  };

  return (
    <div className="space-y-6">
      {/* Region Tabs */}
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRegion(r.value)}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition-all font-medium",
              region === r.value
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-300"
            )}
          >
            {tRegions(r.value)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LeaderboardSkeleton />
      ) : error ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-8 text-center">
          <p className="text-zinc-400">{error}</p>
        </div>
      ) : players.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-8 text-center">
          <p className="text-zinc-400">{t("noData")}</p>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-zinc-600 uppercase tracking-wider border-b border-white/[0.06]">
                  <th className="text-left pl-4 pr-2 py-3 font-medium w-16">{t("rank")}</th>
                  <th className="text-left px-2 py-3 font-medium">{t("player")}</th>
                  <th className="text-center px-2 py-3 font-medium w-16">{t("rank")}</th>
                  <th className="text-center px-2 py-3 font-medium w-20">{t("rr")}</th>
                  <th className="text-center px-2 pr-4 py-3 font-medium w-20">{t("wins")}</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <PlayerRow
                    key={player.puuid || player.leaderboard_rank}
                    player={player}
                    onClick={() => handlePlayerClick(player)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerRow({
  player,
  onClick,
}: {
  player: HenrikLeaderboardPlayer;
  onClick: () => void;
}) {
  const rankInfo = buildRankInfo(player.tier);
  const isTop3 = player.leaderboard_rank <= 3;
  const medalColor =
    player.leaderboard_rank === 1
      ? "text-yellow-400"
      : player.leaderboard_rank === 2
        ? "text-zinc-300"
        : player.leaderboard_rank === 3
          ? "text-amber-600"
          : "text-zinc-500";
  const topRowBg =
    player.leaderboard_rank === 1
      ? "bg-yellow-500/[0.04]"
      : player.leaderboard_rank === 2
        ? "bg-zinc-400/[0.03]"
        : player.leaderboard_rank === 3
          ? "bg-amber-600/[0.03]"
          : "";

  const displayName = player.is_anonymized
    ? "Anonymous"
    : `${player.name}#${player.tag}`;

  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-t border-white/[0.04] transition-colors",
        !player.is_anonymized && "cursor-pointer hover:bg-white/[0.06]",
        isTop3 ? topRowBg : ""
      )}
    >
      <td className="pl-4 pr-2 py-2.5">
        <span className={cn("font-bold text-sm", medalColor)}>
          {player.leaderboard_rank}
        </span>
      </td>
      <td className="px-2 py-2.5">
        <span className={cn("font-medium", isTop3 ? "text-white" : "text-zinc-300")}>
          {displayName}
        </span>
      </td>
      <td className="text-center px-2 py-2.5">
        {rankInfo.iconUrl && (
          <div className="flex justify-center">
            <Image
              src={rankInfo.iconUrl}
              alt={rankInfo.tierName}
              width={20}
              height={20}
              unoptimized
            />
          </div>
        )}
      </td>
      <td className="text-center px-2 py-2.5">
        <span className="text-white font-medium">{player.rr}</span>
      </td>
      <td className="text-center px-2 pr-4 py-2.5 text-zinc-400">
        {player.wins}
      </td>
    </tr>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden">
      <div className="animate-pulse space-y-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04]"
          >
            <div className="w-8 h-4 bg-white/[0.05] rounded" />
            <div className="w-40 h-4 bg-white/[0.05] rounded" />
            <div className="w-5 h-5 bg-white/[0.05] rounded-full ml-auto" />
            <div className="w-12 h-4 bg-white/[0.05] rounded" />
            <div className="w-10 h-4 bg-white/[0.05] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
