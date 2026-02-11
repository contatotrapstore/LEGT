"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import { useFavorites } from "@/hooks/use-favorites";
import { buildProfileUrl } from "@/lib/utils";
import { buildRankInfo } from "@/lib/rank-utils";

export function FavoritesContent() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading, removeFavorite } = useFavorites();
  const t = useTranslations("login");
  const tRegions = useTranslations("regions");

  if (authLoading || loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white/[0.05] rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/[0.03] border border-white/[0.06] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center space-y-4 py-20">
        <div className="text-4xl text-zinc-700">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">{t("favorites")}</h1>
        <p className="text-sm text-zinc-400">{t("loginToFavorites")}</p>
        <a
          href="/login"
          className="inline-block px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("loginButton")}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-7 bg-red-500 rounded-full" />
        <h1 className="text-2xl font-bold text-white">{t("favorites")}</h1>
        <span className="text-xs text-zinc-500 bg-white/[0.04] px-2 py-1 rounded">
          {favorites.length}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-10 text-center">
          <p className="text-zinc-400 text-sm">{t("noFavorites")}</p>
          <p className="text-zinc-600 text-xs mt-2">{t("noFavoritesHint")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favorites.map((fav) => {
            const rankInfo = buildRankInfo(fav.rank_tier);
            const profileUrl = buildProfileUrl(fav.region, fav.riot_name, fav.riot_tag);

            return (
              <div
                key={fav.id}
                className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 hover:bg-white/[0.05] transition-all group"
              >
                {/* Rank icon */}
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                  {rankInfo.iconUrl ? (
                    <Image
                      src={rankInfo.iconUrl}
                      alt={rankInfo.tierName}
                      width={28}
                      height={28}
                      unoptimized
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-white/[0.05]" />
                  )}
                </div>

                {/* Player info */}
                <a href={profileUrl} className="flex-1 min-w-0">
                  <span className="font-semibold text-white text-sm">
                    {fav.riot_name}
                    <span className="text-red-400">#{fav.riot_tag}</span>
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-zinc-500 uppercase">
                      {tRegions(fav.region as "eu" | "na" | "ap" | "kr" | "latam" | "br")}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {rankInfo.tierName}
                    </span>
                  </div>
                </a>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFavorite(fav.riot_name, fav.riot_tag)}
                  className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  title={t("removeFavorite")}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
