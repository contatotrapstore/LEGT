"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { AccountData, RankInfo } from "@/types/valorant";
import { RankCard } from "./rank-card";
import { FavoriteButton } from "./favorite-button";
import { Badge } from "@/components/ui/badge";

interface PlayerBannerProps {
  account: AccountData;
  currentRank: RankInfo;
  peakRank: RankInfo;
}

export function PlayerBanner({
  account,
  currentRank,
  peakRank,
}: PlayerBannerProps) {
  const t = useTranslations("common");

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] min-h-[240px] sm:min-h-[280px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background card image */}
      {account.card.wide && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${account.card.wide})`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* Bottom red accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
        {/* Player info */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {account.gameName}
            </h1>
            <span className="text-xl sm:text-2xl font-medium text-red-400">
              #{account.tagLine}
            </span>
            <FavoriteButton
              riotName={account.gameName}
              riotTag={account.tagLine}
              region={account.region}
              rankTier={currentRank.tier}
              rankIconUrl={currentRank.iconUrl}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Badge variant="accent">{account.region.toUpperCase()}</Badge>
            <Badge>{t("level")} {account.accountLevel}</Badge>
            {peakRank.tier > 0 && peakRank.tier !== currentRank.tier && (
              <Badge variant="rank">
                {t("peak")}: {peakRank.tierName}
              </Badge>
            )}
          </div>
        </div>

        {/* Rank card */}
        <div className="shrink-0">
          <RankCard rank={currentRank} size="hero" />
        </div>
      </div>
    </motion.div>
  );
}
