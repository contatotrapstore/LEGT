"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/auth-provider";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  riotName: string;
  riotTag: string;
  region: string;
  rankTier?: number;
  rankIconUrl?: string;
}

export function FavoriteButton({
  riotName,
  riotTag,
  region,
  rankTier,
  rankIconUrl,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [animating, setAnimating] = useState(false);
  const t = useTranslations("login");

  if (!user) return null;

  const favorited = isFavorite(riotName, riotTag);

  const handleToggle = async () => {
    setAnimating(true);
    if (favorited) {
      await removeFavorite(riotName, riotTag);
    } else {
      await addFavorite({
        riotName,
        riotTag,
        region,
        displayName: `${riotName}#${riotTag}`,
        rankTier,
        rankIconUrl,
      });
    }
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={favorited ? t("removeFavorite") : t("addFavorite")}
      className={cn(
        "p-2 rounded-lg border transition-all duration-200",
        favorited
          ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
          : "bg-white/[0.03] border-white/[0.06] text-zinc-500 hover:text-yellow-400 hover:bg-white/[0.06]",
        animating && "scale-110"
      )}
    >
      <svg
        className="w-4 h-4"
        fill={favorited ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    </button>
  );
}
