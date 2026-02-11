"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { POPULAR_PLAYERS } from "@/lib/constants";
import {
  getRecentSearches,
  clearRecentSearches,
  type SearchEntry,
} from "@/lib/recent-searches";

interface SearchSuggestionsProps {
  query: string;
  visible: boolean;
  onSelect: (entry: SearchEntry) => void;
}

export function SearchSuggestions({
  query,
  visible,
  onSelect,
}: SearchSuggestionsProps) {
  const t = useTranslations("search");

  const { recent, popular } = useMemo(() => {
    const recentSearches = getRecentSearches();
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return {
        recent: recentSearches.slice(0, 5),
        popular: POPULAR_PLAYERS.slice(0, 5),
      };
    }

    const filterFn = (e: SearchEntry) => {
      const full = `${e.name}#${e.tag}`.toLowerCase();
      return (
        e.name.toLowerCase().includes(lowerQuery) ||
        e.tag.toLowerCase().includes(lowerQuery) ||
        full.includes(lowerQuery)
      );
    };

    return {
      recent: recentSearches.filter(filterFn).slice(0, 4),
      popular: POPULAR_PLAYERS.filter(filterFn).slice(0, 4),
    };
  }, [query]);

  const hasResults = recent.length > 0 || popular.length > 0;

  return (
    <AnimatePresence>
      {visible && hasResults && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg shadow-2xl backdrop-blur-xl overflow-hidden z-50"
        >
          {/* Recent searches */}
          {recent.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                  {t("recent")}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearRecentSearches();
                    // Force re-render by triggering a tiny state update in parent
                  }}
                  className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {t("clearRecent")}
                </button>
              </div>
              {recent.map((entry, i) => (
                <SuggestionRow
                  key={`recent-${entry.name}-${entry.tag}-${i}`}
                  entry={entry}
                  icon="clock"
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}

          {/* Popular players */}
          {popular.length > 0 && (
            <div>
              <div className="px-3 pt-2.5 pb-1">
                {recent.length > 0 && (
                  <div className="border-t border-white/[0.04] -mx-3 mb-2" />
                )}
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                  {t("popular")}
                </span>
              </div>
              {popular.map((entry, i) => (
                <SuggestionRow
                  key={`popular-${entry.name}-${entry.tag}-${i}`}
                  entry={entry}
                  icon="star"
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}

          <div className="h-1.5" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuggestionRow({
  entry,
  icon,
  onSelect,
}: {
  entry: SearchEntry;
  icon: "clock" | "star";
  onSelect: (entry: SearchEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="w-full px-3 py-2 text-left hover:bg-white/[0.05] transition-colors flex items-center gap-2.5 group"
    >
      {icon === "clock" ? (
        <svg
          className="w-3.5 h-3.5 text-zinc-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5 text-zinc-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-white font-medium">
          {entry.name}
          <span className="text-zinc-500">#{entry.tag}</span>
        </span>
      </div>
      <span className="text-[10px] text-zinc-600 uppercase shrink-0">
        {entry.region}
      </span>
      <svg
        className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
