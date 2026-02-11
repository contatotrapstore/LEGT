"use client";

import type { RankKey } from "@/types/valorant";

interface RankThemeProviderProps {
  rankKey: RankKey;
  children: React.ReactNode;
}

export function RankThemeProvider({
  rankKey,
  children,
}: RankThemeProviderProps) {
  return (
    <div data-rank={rankKey} className="min-h-screen">
      {children}
    </div>
  );
}
