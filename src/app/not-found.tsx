import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-5">
        <h1 className="text-7xl font-bold bg-gradient-to-b from-red-500 to-red-600/50 bg-clip-text text-transparent">
          {t("title")}
        </h1>
        <p className="text-lg text-zinc-400">{t("subtitle")}</p>
        <a
          href="/"
          className="inline-block text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          {t("goHome")}
        </a>
      </div>
    </div>
  );
}
