export const locales = ["en", "pt-BR", "es", "ko"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  "pt-BR": "Portugues",
  es: "Espanol",
  ko: "한국어",
};

export const regionToLocale: Record<string, Locale> = {
  eu: "en",
  na: "en",
  ap: "en",
  kr: "ko",
  latam: "es",
  br: "pt-BR",
};

export const localeToDefaultRegion: Record<Locale, string> = {
  en: "na",
  "pt-BR": "br",
  es: "latam",
  ko: "kr",
};

export function detectLocaleFromHeader(acceptLanguage: string): Locale {
  const normalized = acceptLanguage.toLowerCase();
  if (normalized.includes("pt")) return "pt-BR";
  if (normalized.includes("ko")) return "ko";
  if (normalized.includes("es")) return "es";
  return "en";
}

export const defaultLocale: Locale = "en";
