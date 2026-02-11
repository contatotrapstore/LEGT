"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GlowBorder({
  children,
  className,
  animate = true,
}: GlowBorderProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl p-[1px] overflow-hidden",
        className
      )}
      style={{
        background: `linear-gradient(135deg, var(--rank-primary), var(--rank-accent), var(--rank-secondary))`,
      }}
      whileHover={animate ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="rounded-2xl bg-[#0D0D10] h-full">{children}</div>
      {animate && (
        <div
          className="absolute inset-0 rounded-2xl animate-glow-pulse pointer-events-none"
        />
      )}
    </motion.div>
  );
}
