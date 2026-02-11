"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { RankInfo } from "@/types/valorant";
import { GlowBorder } from "@/components/ui/glow-border";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatRR } from "@/lib/rank-utils";

interface RankCardProps {
  rank: RankInfo;
  size?: "hero" | "compact";
}

export function RankCard({ rank, size = "hero" }: RankCardProps) {
  const isHero = size === "hero";

  return (
    <GlowBorder>
      <motion.div
        className={`flex flex-col items-center gap-2 ${
          isHero ? "p-5 min-w-[140px]" : "p-3"
        }`}
        whileHover={{
          rotateY: 5,
          rotateX: -5,
          transition: { duration: 0.3 },
        }}
        style={{ perspective: 1000 }}
      >
        {/* Rank icon */}
        <div className={`relative ${isHero ? "w-20 h-20" : "w-12 h-12"}`}>
          {rank.iconUrl ? (
            <Image
              src={rank.iconUrl}
              alt={rank.tierName}
              fill
              className="object-contain"
              style={{
                filter: `drop-shadow(0 0 12px var(--rank-glow))`,
              }}
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center font-bold"
              style={{
                background: `linear-gradient(135deg, var(--rank-gradient-from), var(--rank-gradient-to))`,
                color: `var(--rank-primary)`,
              }}
            >
              <span className={isHero ? "text-xl" : "text-sm"}>?</span>
            </div>
          )}
        </div>

        {/* Rank name */}
        <div className="text-center">
          <div
            className={`font-bold text-white ${
              isHero ? "text-lg" : "text-sm"
            }`}
          >
            {rank.tierName}
          </div>
          {isHero && (
            <div className="text-xs text-zinc-400 mt-0.5">
              {formatRR(rank.rr)}
            </div>
          )}
        </div>

        {/* RR Progress bar */}
        {isHero && rank.tier > 0 && (
          <ProgressBar value={rank.rr} className="w-full" />
        )}
      </motion.div>
    </GlowBorder>
  );
}
