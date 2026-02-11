import { NextResponse } from "next/server";
import { getProvider } from "@/lib/api/henrik-provider";
import { transformMatchToDetail } from "@/lib/stats-calculator";
import { ApiError } from "@/lib/api/http-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get("puuid") || "";
  const region = searchParams.get("region") || "";

  try {
    const provider = getProvider();
    const raw = await provider.getMatchById(matchId);
    const detail = transformMatchToDetail(raw, puuid);

    // Enrich unranked players with their current MMR (for non-competitive modes)
    if (region) {
      const allPlayers = [...detail.teams.blue, ...detail.teams.red];
      const unrankedPlayers = allPlayers.filter((p) => p.rank < 3);

      if (unrankedPlayers.length > 0) {
        const results = await Promise.allSettled(
          unrankedPlayers.map((p) => provider.getMMRByPuuid(region, p.puuid))
        );

        unrankedPlayers.forEach((p, i) => {
          const result = results[i];
          if (
            result.status === "fulfilled" &&
            result.value &&
            result.value.currenttier >= 3
          ) {
            p.rank = result.value.currenttier;
            p.rankPatched = result.value.currenttierpatched;
          }
        });
      }
    }

    return NextResponse.json({ data: detail });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.userFriendlyMessage, matchId },
        { status: err.status >= 400 ? err.status : 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch match data.", matchId },
      { status: 500 }
    );
  }
}
