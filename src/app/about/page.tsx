import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tFooter = await getTranslations("footer");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-7 bg-red-500 rounded-full" />
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
        </div>
        <p className="text-sm text-zinc-500 ml-4">{t("subtitle")}</p>
      </div>

      <div className="space-y-8">
        {/* What is LEGT */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">{t("whatIs")}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">{t("whatIsDesc")}</p>
        </section>

        {/* Features */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">{t("features")}</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <FeatureCard icon="rank" title={t("featureRank")} desc={t("featureRankDesc")} />
            <FeatureCard icon="stats" title={t("featureStats")} desc={t("featureStatsDesc")} />
            <FeatureCard icon="matches" title={t("featureMatches")} desc={t("featureMatchesDesc")} />
          </div>
        </section>

        {/* Data Source */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">{t("dataSource")}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">{t("dataSourceDesc")}</p>
        </section>

        {/* Disclaimer */}
        <section className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
          <p className="text-xs text-zinc-600 leading-relaxed">{tFooter("disclaimer")}</p>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const icons: Record<string, React.ReactNode> = {
    rank: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    stats: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    matches: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 text-center">
      <div className="text-red-500 mb-2 flex justify-center">{icons[icon]}</div>
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-zinc-500">{desc}</p>
    </div>
  );
}
