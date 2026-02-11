import { getTranslations } from "next-intl/server";
import { SearchBar } from "@/components/layout/search-bar";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-600/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-red-500/[0.03] rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center space-y-10">
        <div className="space-y-4">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-white">
            LEG<span className="text-red-500">T</span>
          </h1>
          <p className="text-lg text-zinc-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-3">
          <SearchBar size="hero" />
          <p className="text-xs text-zinc-600">
            {t("searchHint")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4">
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
              </svg>
            }
            title={t("featureRank")}
            description={t("featureRankDesc")}
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            }
            title={t("featureStats")}
            description={t("featureStatsDesc")}
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title={t("featureMatches")}
            description={t("featureMatchesDesc")}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300 group text-center">
      <div className="text-red-500 mb-2.5 group-hover:text-red-400 transition-colors flex justify-center">
        {icon}
      </div>
      <div className="text-sm font-semibold text-white mb-0.5">{title}</div>
      <div className="text-[11px] text-zinc-500 leading-relaxed">{description}</div>
    </div>
  );
}
