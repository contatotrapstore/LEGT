import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default async function TermsPage() {
  const t = await getTranslations("terms");

  const sections = [
    { title: t("acceptanceTitle"), content: t("acceptanceDesc") },
    { title: t("serviceTitle"), content: t("serviceDesc") },
    { title: t("conductTitle"), content: t("conductDesc") },
    { title: t("ipTitle"), content: t("ipDesc") },
    { title: t("disclaimerTitle"), content: t("disclaimerDesc") },
    { title: t("liabilityTitle"), content: t("liabilityDesc") },
    { title: t("changesTitle"), content: t("changesDesc") },
    { title: t("contactTitle"), content: t("contactDesc") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{t("title")}</h1>
        <p className="text-xs text-zinc-600">{t("lastUpdated")}</p>
      </div>

      <div className="space-y-6">
        {sections.map((s) => (
          <section key={s.title} className="space-y-2">
            <h2 className="text-base font-semibold text-white">{s.title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">{s.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
