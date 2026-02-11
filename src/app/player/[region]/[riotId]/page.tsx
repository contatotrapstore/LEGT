import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ActData, ProfileData } from "@/types/valorant";
import { parseRiotId, buildRiotIdSlug } from "@/lib/utils";
import { RankThemeProvider } from "@/components/providers/theme-provider";
import { PlayerBanner } from "@/components/profile/player-banner";
import { RankJourney } from "@/components/profile/rank-journey";
import { ProfileContent } from "@/components/profile/profile-content";
import { getProvider } from "@/lib/api/henrik-provider";
import { ApiError } from "@/lib/api/http-client";
import { buildRankInfo } from "@/lib/rank-utils";
import {
  computePlayerStats,
  computeAgentStats,
  computeMapStats,
  transformLifetimeMatchToSummary,
  correlateMatchesWithMMR,
} from "@/lib/stats-calculator";

interface ProfilePageProps {
  params: Promise<{ region: string; riotId: string }>;
}

interface ProfileResponse {
  data?: ProfileData;
  error?: string;
  code?: string;
}

async function getProfile(
  region: string,
  name: string,
  tag: string
): Promise<ProfileResponse> {
  try {
    const provider = getProvider();

    // Account is required
    let account;
    try {
      account = await provider.getAccountByRiotId(name, tag);
    } catch (err) {
      if (err instanceof ApiError) {
        return { error: err.userFriendlyMessage, code: `HENRIK_${err.henrikCode}` };
      }
      throw err;
    }

    // Fetch remaining data in parallel with graceful fallbacks
    const [mmr, rawMatches, mmrHistory] = await Promise.all([
      provider.getMMRByRiotId(region, name, tag).catch(() => null),
      provider.getLifetimeMatches(region, name, tag, { size: 20 }).catch(() => []),
      provider.getMMRHistoryByRiotId(region, name, tag).catch(() => []),
    ]);

    const stats = computePlayerStats(rawMatches);
    const agentStats = computeAgentStats(rawMatches);
    const mapStats = computeMapStats(rawMatches);

    const recentMatches = rawMatches.map((m) =>
      transformLifetimeMatchToSummary(m)
    );
    correlateMatchesWithMMR(recentMatches, mmrHistory);

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

    return { data: profile };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.userFriendlyMessage, code: `HENRIK_${error.henrikCode}` };
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: message, code: "UNKNOWN" };
  }
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { region, riotId } = await params;
  const parsed = parseRiotId(riotId);
  if (!parsed) return { title: "Player Not Found" };

  const result = await getProfile(region, parsed.name, parsed.tag);
  if (!result.data) return { title: `${parsed.name}#${parsed.tag}` };

  const profile = result.data;
  const title = `${profile.account.gameName}#${profile.account.tagLine} - ${profile.mmr.currentRank.tierName}`;
  const description = `${profile.mmr.currentRank.tierName} | K/D: ${profile.stats.kd.toFixed(2)} | Win Rate: ${profile.stats.winRate.toFixed(1)}% | ACS: ${profile.stats.acs}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { region, riotId } = await params;
  const parsed = parseRiotId(riotId);
  const t = await getTranslations("profile");
  const tCommon = await getTranslations("common");

  if (!parsed) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="text-5xl text-zinc-700">?</div>
          <h1 className="text-2xl font-bold text-white">
            {t("invalidUrl")}
          </h1>
          <p className="text-zinc-400">
            {t("riotIdFormat")}
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white hover:bg-white/[0.08] transition-colors backdrop-blur-sm"
          >
            {tCommon("backToSearch")}
          </a>
        </div>
      </div>
    );
  }

  const result = await getProfile(region, parsed.name, parsed.tag);

  if (!result.data) {
    const isDataUnavailable = result.code === "HENRIK_24";
    const isAccountNotFound = result.code === "HENRIK_22";
    const playerName = `${parsed.name}#${parsed.tag}`;

    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="text-5xl text-zinc-700">
            {isDataUnavailable ? "..." : isAccountNotFound ? "X" : "!"}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isDataUnavailable
              ? t("dataUnavailable")
              : isAccountNotFound
                ? t("playerNotFound")
                : t("somethingWentWrong")}
          </h1>
          <p className="text-zinc-400">
            {isDataUnavailable ? (
              t("needsRecentGame", { name: playerName })
            ) : isAccountNotFound ? (
              t("checkNameTag", { name: playerName })
            ) : (
              result.error || t("unexpectedError")
            )}
          </p>

          {isAccountNotFound && (
            <div className="mt-2 p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
              <p className="text-xs text-zinc-600 mb-2">{t("tips")}:</p>
              <ul className="text-xs text-zinc-400 space-y-1 text-left">
                <li>- {t("tipCorrectTag")}</li>
                <li>- {t("tipCaseSensitive")}</li>
                <li>- {t("tipPlayedGame")}</li>
              </ul>
            </div>
          )}

          <a
            href="/"
            className="inline-block mt-4 px-6 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white hover:bg-white/[0.08] transition-colors backdrop-blur-sm"
          >
            {tCommon("backToSearch")}
          </a>
        </div>
      </div>
    );
  }

  const profile = result.data;
  const rankKey = profile.mmr.currentRank.rankKey;
  const riotIdSlug = buildRiotIdSlug(
    profile.account.gameName,
    profile.account.tagLine
  );

  return (
    <RankThemeProvider rankKey={rankKey}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PlayerBanner
          account={profile.account}
          currentRank={profile.mmr.currentRank}
          peakRank={profile.mmr.peakRank}
        />

        {profile.actHistory.length > 0 && (
          <RankJourney acts={profile.actHistory} />
        )}

        <ProfileContent
          profile={profile}
          region={region}
          riotId={riotIdSlug}
        />
      </div>
    </RankThemeProvider>
  );
}
