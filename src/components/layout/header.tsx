"use client";

import { useTranslations } from "next-intl";
import { SearchBar } from "./search-bar";
import { LanguageSelector } from "./language-selector";
import { UserMenu } from "./user-menu";

export function Header() {
  const t = useTranslations("common");
  const tNav = useTranslations("navigation");

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-white tracking-tight">
              LEG<span className="text-red-500">T</span>
            </span>
            <span className="hidden lg:inline text-[10px] text-zinc-600 font-medium tracking-wider uppercase">
              Valorant Tracker
            </span>
          </a>

          {/* Navigation — desktop only */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <a
              href="/"
              className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              {tNav("home")}
            </a>
            <a
              href="/leaderboard"
              className="px-3 py-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              {tNav("leaderboard")}
            </a>
            <a
              href="/about"
              className="px-3 py-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              {tNav("about")}
            </a>
          </nav>

          {/* Search bar — desktop */}
          <div className="flex-1 max-w-md hidden sm:block">
            <SearchBar />
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            <LanguageSelector />
            <UserMenu />
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pt-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
