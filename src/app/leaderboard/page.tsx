import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  const t = await getTranslations("leaderboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 bg-red-500 rounded-full" />
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        </div>
        <p className="text-sm text-zinc-500 ml-4">{t("subtitle")}</p>
      </div>
      <LeaderboardContent />
    </div>
  );
}
