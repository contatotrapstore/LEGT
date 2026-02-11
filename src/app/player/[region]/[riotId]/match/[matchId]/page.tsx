import type { MatchDetail } from "@/types/valorant";
import { parseRiotId } from "@/lib/utils";
import { RankThemeProvider } from "@/components/providers/theme-provider";
import { MatchSummaryHeader } from "@/components/match/match-summary";
import { PlayerPerformance } from "@/components/match/player-performance";
import { TeamTable } from "@/components/match/team-table";
import { tierToRankKey } from "@/lib/rank-utils";
import { getProvider } from "@/lib/api/henrik-provider";
import { transformMatchToDetail } from "@/lib/stats-calculator";
import Link from "next/link";

interface MatchPageProps {
  params: Promise<{ region: string; riotId: string; matchId: string }>;
}

async function getMatch(matchId: string): Promise<MatchDetail | null> {
  try {
    const provider = getProvider();
    const raw = await provider.getMatchById(matchId);
    return transformMatchToDetail(raw, "");
  } catch {
    return null;
  }
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { region, riotId, matchId } = await params;
  const parsed = parseRiotId(riotId);

  if (!parsed) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-text-secondary">Invalid profile URL</p>
      </div>
    );
  }

  const match = await getMatch(matchId);

  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            Match Not Found
          </h1>
          <p className="text-text-secondary">Could not load match details.</p>
          <Link
            href={`/@/${region}/${riotId}`}
            className="text-rank-primary hover:underline text-sm"
          >
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  // Find the observed player
  const allPlayers = [...match.teams.blue, ...match.teams.red];
  const observedPlayer = allPlayers.find(
    (p) =>
      p.name.toLowerCase() === parsed.name.toLowerCase() &&
      p.tag.toLowerCase() === parsed.tag.toLowerCase()
  );

  // Mark observed player
  if (observedPlayer) {
    observedPlayer.isObserved = true;
  }

  const playerTeam = observedPlayer?.team ?? "blue";
  const rankKey = observedPlayer
    ? tierToRankKey(observedPlayer.rank)
    : "unranked";

  return (
    <RankThemeProvider rankKey={rankKey}>
      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Back link */}
        <Link
          href={`/@/${region}/${riotId}`}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          &larr; Back to profile
        </Link>

        <MatchSummaryHeader match={match} playerTeam={playerTeam} />

        {observedPlayer && (
          <PlayerPerformance player={observedPlayer} />
        )}

        <TeamTable
          players={match.teams[playerTeam]}
          title={playerTeam === "blue" ? "Your Team" : "Your Team"}
          isPlayerTeam
        />

        <TeamTable
          players={match.teams[playerTeam === "blue" ? "red" : "blue"]}
          title="Enemy Team"
        />
      </div>
    </RankThemeProvider>
  );
}
