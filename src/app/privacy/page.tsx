import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  const sections = [
    { title: t("infoCollectedTitle"), content: t("infoCollectedDesc") },
    { title: t("howWeUseTitle"), content: t("howWeUseDesc") },
    { title: t("cookiesTitle"), content: t("cookiesDesc") },
    { title: t("thirdPartyTitle"), content: t("thirdPartyDesc") },
    { title: t("dataRetentionTitle"), content: t("dataRetentionDesc") },
    { title: t("yourRightsTitle"), content: t("yourRightsDesc") },
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
