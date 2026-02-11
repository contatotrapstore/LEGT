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

  try {
    const provider = getProvider();
    const raw = await provider.getMatchById(matchId);
    const detail = transformMatchToDetail(raw, puuid);
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
