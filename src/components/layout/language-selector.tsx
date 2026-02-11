"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg bg-white/[0.05] border border-white/[0.08] text-zinc-400 text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 backdrop-blur-sm cursor-pointer hover:text-white transition-colors"
      aria-label="Language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc} className="bg-zinc-900">
          {localeNames[loc as Locale]}
        </option>
      ))}
    </select>
  );
}
