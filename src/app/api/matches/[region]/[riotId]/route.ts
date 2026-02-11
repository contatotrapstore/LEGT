import { NextResponse } from "next/server";
import { getProvider } from "@/lib/api/henrik-provider";
import { ApiError } from "@/lib/api/http-client";
import { parseRiotId } from "@/lib/utils";
import { transformLifetimeMatchToSummary } from "@/lib/stats-calculator";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ region: string; riotId: string }> }
) {
  try {
    const { region, riotId } = await params;
    const parsed = parseRiotId(riotId);

    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid Riot ID format" },
        { status: 400 }
      );
    }

    const { name, tag } = parsed;
    const provider = getProvider();

    const rawMatches = await provider.getLifetimeMatches(region, name, tag, {
      size: 20,
    });

    const matches = rawMatches.map((m) =>
      transformLifetimeMatchToSummary(m)
    );

    return NextResponse.json({ data: matches });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.userFriendlyMessage },
        { status: error.status }
      );
    }
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
