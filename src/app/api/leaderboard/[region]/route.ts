import { NextResponse } from "next/server";
import { getProvider } from "@/lib/api/henrik-provider";
import { ApiError } from "@/lib/api/http-client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ region: string }> }
) {
  const { region } = await params;

  const validRegions = ["eu", "na", "ap", "kr", "latam", "br"];
  if (!validRegions.includes(region)) {
    return NextResponse.json(
      { error: "Invalid region" },
      { status: 400 }
    );
  }

  try {
    const provider = getProvider();
    const players = await provider.getLeaderboard(region);
    return NextResponse.json({ data: { players } });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { error: err.userFriendlyMessage },
        { status: err.status >= 400 ? err.status : 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data." },
      { status: 500 }
    );
  }
}
