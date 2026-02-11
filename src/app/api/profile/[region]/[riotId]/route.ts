import { NextResponse } from "next/server";
import { getProvider } from "@/lib/api/henrik-provider";
import { ApiError } from "@/lib/api/http-client";
import { parseRiotId } from "@/lib/utils";
import {
  computePlayerStats,
  computeAgentStats,
  computeMapStats,
  transformLifetimeMatchToSummary,
  correlateMatchesWithMMR,
} from "@/lib/stats-calculator";
import { buildRankInfo } from "@/lib/rank-utils";
import type { ActData, ProfileData } from "@/types/valorant";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ region: string; riotId: string }> }
) {
  try {
    const { region, riotId } = await params;
    const parsed = parseRiotId(riotId);

    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid Riot ID format", code: "INVALID_FORMAT" },
        { status: 400 }
      );
    }

    const { name, tag } = parsed;
    const provider = getProvider();

    // Account is required - if this fails, we can't show anything
    let account;
    try {
      account = await provider.getAccountByRiotId(name, tag);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: err.userFriendlyMessage, code: `HENRIK_${err.henrikCode}` },
          { status: err.status }
        );
      }
      throw err;
    }

    // Fetch remaining data in parallel - each with graceful fallback
    const [mmr, rawMatches, mmrHistory] = await Promise.all([
      provider.getMMRByRiotId(region, name, tag).catch(() => null),
      provider.getLifetimeMatches(region, name, tag, { size: 20 }).catch(() => []),
      provider.getMMRHistoryByRiotId(region, name, tag).catch(() => []),
    ]);

    // Compute stats from lifetime matches
    const stats = computePlayerStats(rawMatches);
    const agentStats = computeAgentStats(rawMatches);
    const mapStats = computeMapStats(rawMatches);

    // Transform matches to summaries and correlate with MMR history
    const recentMatches = rawMatches.map((m) =>
      transformLifetimeMatchToSummary(m)
    );
    correlateMatchesWithMMR(recentMatches, mmrHistory);

    // Build act history from seasonal data
    const actHistory: ActData[] = mmr
      ? Object.entries(mmr.seasonalData)
          .filter(([, data]) => data.gamesPlayed > 0)
          .map(([actId, data]) => ({
            actId,
            actName: actId.replace(/e(\d+)a(\d+)/i, "Episode $1 Act $2"),
            peakRank: buildRankInfo(
              Math.max(...data.actRankWins.map((w) => w.tier), data.finalRank)
            ),
            wins: data.wins,
            losses: data.losses,
            rr: 0,
          }))
          .reverse()
          .slice(0, 6)
      : [];

    const profile: ProfileData = {
      account,
      mmr: mmr ?? {
        currentRank: buildRankInfo(0),
        peakRank: buildRankInfo(0),
        rankingInTier: 0,
        elo: 0,
        gamesNeededForRating: 0,
        seasonalData: {},
      },
      stats,
      agentStats,
      recentMatches,
      actHistory,
      mapStats,
      rawMatches,
      mmrHistory,
    };

    return NextResponse.json({ data: profile });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.userFriendlyMessage, code: `HENRIK_${error.henrikCode}` },
        { status: error.status }
      );
    }
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message, code: "UNKNOWN" }, { status: 500 });
  }
}
