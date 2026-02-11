import { getTranslations } from "next-intl/server";
import type { ActData } from "@/types/valorant";
import { ActCard } from "./act-card";

interface RankJourneyProps {
  acts: ActData[];
}

export async function RankJourney({ acts }: RankJourneyProps) {
  if (acts.length === 0) return null;

  const t = await getTranslations("rankJourney");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-red-500 rounded-full" />
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scroll-smooth">
        {acts.map((act, i) => (
          <ActCard key={act.actId} act={act} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}
