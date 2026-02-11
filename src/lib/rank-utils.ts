import { RANK_TIERS } from "./constants";
import type { RankInfo, RankKey } from "@/types/valorant";

export function tierToRankKey(tier: number): RankKey {
  if (tier <= 2) return "unranked";
  if (tier <= 5) return "iron";
  if (tier <= 8) return "bronze";
  if (tier <= 11) return "silver";
  if (tier <= 14) return "gold";
  if (tier <= 17) return "platinum";
  if (tier <= 20) return "diamond";
  if (tier <= 23) return "ascendant";
  if (tier <= 26) return "immortal";
  return "radiant";
}

export function tierToRankName(tier: number): string {
  const info = RANK_TIERS[tier];
  return info?.name ?? "Unranked";
}

export function tierToDivision(tier: number): number {
  const info = RANK_TIERS[tier];
  return info?.division ?? 0;
}

export function buildRankInfo(
  tier: number,
  rr: number = 0,
  elo: number = 0
): RankInfo {
  return {
    tier,
    tierName: tierToRankName(tier),
    rankKey: tierToRankKey(tier),
    division: tierToDivision(tier),
    rr,
    elo,
    iconUrl:
      tier >= 3
        ? `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${tier}/largeicon.png`
        : "",
  };
}

export function compareTiers(a: number, b: number): number {
  return a - b;
}

export function formatRR(rr: number): string {
  return `${rr} RR`;
}
