"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ActData } from "@/types/valorant";

interface ActCardProps {
  act: ActData;
  delay?: number;
}

export function ActCard({ act, delay = 0 }: ActCardProps) {
  return (
    <motion.div
      className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 min-w-[140px] shrink-0 backdrop-blur-sm hover:bg-white/[0.05] transition-all duration-200"
      style={{
        borderTopColor: `var(--rank-primary)`,
        borderTopWidth: "2px",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="text-[11px] text-zinc-500 mb-1.5 tracking-wide">{act.actName}</div>
      <div className="flex items-center gap-1.5">
        {act.peakRank.iconUrl && (
          <div className="relative w-6 h-6 shrink-0">
            <Image
              src={act.peakRank.iconUrl}
              alt={act.peakRank.tierName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        <div className="font-bold text-white text-sm">
          {act.peakRank.tierName}
        </div>
      </div>
      <div className="text-xs text-zinc-500 mt-1">
        {act.wins}W {act.losses}L
      </div>
    </motion.div>
  );
}
