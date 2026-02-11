"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export function StatTile({
  label,
  value,
  subValue,
  trend,
  delay = 0,
}: StatTileProps) {
  return (
    <motion.div
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-1 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold text-white">{value}</span>
        {trend && (
          <span
            className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", {
              "bg-emerald-500/10 text-emerald-400": trend === "up",
              "bg-red-500/10 text-red-400": trend === "down",
              "text-zinc-600": trend === "neutral",
            })}
          >
            {trend === "up" ? "\u25B2" : trend === "down" ? "\u25BC" : "\u25CF"}
          </span>
        )}
      </div>
      {subValue && (
        <span className="text-xs text-zinc-500">{subValue}</span>
      )}
    </motion.div>
  );
}
