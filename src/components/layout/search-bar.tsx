"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/lib/constants";
import { buildProfileUrl } from "@/lib/utils";
import { regionToLocale } from "@/i18n/config";
import { addRecentSearch, type SearchEntry } from "@/lib/recent-searches";
import { SearchSuggestions } from "./search-suggestions";

interface SearchBarProps {
  size?: "default" | "hero";
  defaultRegion?: string;
}

export function SearchBar({
  size = "default",
  defaultRegion = "eu",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState(defaultRegion);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("search");
  const tCommon = useTranslations("common");
  const tRegions = useTranslations("regions");

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSuggestions(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Read auto-detected region from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/PREFERRED_REGION=(\w+)/);
    if (match && REGIONS.some((r) => r.value === match[1])) {
      setRegion(match[1]);
    }
  }, []);

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    document.cookie = `PREFERRED_REGION=${newRegion};path=/;max-age=31536000`;
    const locale = regionToLocale[newRegion];
    if (locale) {
      document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
      router.refresh();
    }
  };

  const navigateToProfile = (name: string, tag: string, targetRegion: string) => {
    addRecentSearch({ name, tag, region: targetRegion });
    const url = buildProfileUrl(targetRegion, name, tag);
    router.push(url);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowSuggestions(false);

    const parts = query.split("#");
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      setError(t("validationError"));
      return;
    }

    const [name, tag] = parts.map((p) => p.trim());
    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tag }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || t("notFound"));
        return;
      }

      const accountRegion = json.data?.region || region;
      const actualRegion = REGIONS.some((r) => r.value === accountRegion)
        ? accountRegion
        : region;

      navigateToProfile(name, tag, actualRegion);
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = (entry: SearchEntry) => {
    setQuery(`${entry.name}#${entry.tag}`);
    setRegion(entry.region);
    setShowSuggestions(false);
    navigateToProfile(entry.name, entry.tag, entry.region);
  };

  const isHero = size === "hero";

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div
        ref={containerRef}
        className={`relative flex gap-2 ${isHero ? "flex-col sm:flex-row" : "flex-row"}`}
      >
        <select
          value={region}
          onChange={(e) => handleRegionChange(e.target.value)}
          className={`rounded-lg bg-white/[0.05] border border-white/[0.08] text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 backdrop-blur-sm ${
            isHero ? "sm:w-32" : "w-28"
          }`}
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value} className="bg-zinc-900">
              {tRegions(r.value)}
            </option>
          ))}
        </select>

        <div className="flex-1 relative">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError("");
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={t("placeholder")}
            className={isHero ? "text-lg py-3.5" : ""}
          />

          <SearchSuggestions
            query={query}
            visible={showSuggestions && !loading}
            onSelect={handleSuggestionSelect}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !query.trim()}
          size={isHero ? "lg" : "md"}
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            tCommon("search")
          )}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </form>
  );
}
