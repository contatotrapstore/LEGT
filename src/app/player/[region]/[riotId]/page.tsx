import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ProfileData } from "@/types/valorant";
import { parseRiotId, buildRiotIdSlug } from "@/lib/utils";
import { RankThemeProvider } from "@/components/providers/theme-provider";
import { PlayerBanner } from "@/components/profile/player-banner";
import { RankJourney } from "@/components/profile/rank-journey";
import { ProfileContent } from "@/components/profile/profile-content";

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
  riotId: string
): Promise<ProfileResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(
      `${baseUrl}/api/profile/${region}/${riotId}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (!res.ok) {
      return { error: json.error, code: json.code };
    }
    return { data: json.data };
  } catch {
    return { error: "Failed to connect to the server." };
  }
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { region, riotId } = await params;
  const parsed = parseRiotId(riotId);
  if (!parsed) return { title: "Player Not Found" };

  const result = await getProfile(region, riotId);
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

  const result = await getProfile(region, riotId);

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
