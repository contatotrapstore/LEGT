"use client";

import { motion } from "framer-motion";
import type { MatchDetail } from "@/types/valorant";
import { cn, formatDuration } from "@/lib/utils";
import { QUEUE_DISPLAY } from "@/lib/constants";

interface MatchSummaryProps {
  match: MatchDetail;
  playerTeam: "blue" | "red";
}

export function MatchSummaryHeader({ match, playerTeam }: MatchSummaryProps) {
  const teamScore =
    playerTeam === "blue" ? match.score.blue : match.score.red;
  const enemyScore =
    playerTeam === "blue" ? match.score.red : match.score.blue;
  const won = teamScore > enemyScore;
  const draw = teamScore === enemyScore;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-bg-secondary border border-border-subtle"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          won ? "bg-gradient-to-r from-win/20 to-transparent" : "",
          !won && !draw
            ? "bg-gradient-to-r from-loss/20 to-transparent"
            : "",
          draw ? "bg-gradient-to-r from-draw/20 to-transparent" : ""
        )}
      />

      <div className="relative p-6 text-center space-y-3">
        <div className="text-sm text-text-muted">
          {QUEUE_DISPLAY[match.mode] ?? match.mode} &middot; {match.map}
        </div>

        <div className="flex items-center justify-center gap-4">
          <span
            className={cn("text-4xl font-bold", {
              "text-win": won,
              "text-loss": !won && !draw,
              "text-draw": draw,
            })}
          >
            {teamScore}
          </span>
          <span className="text-xl text-text-muted">-</span>
          <span className="text-4xl font-bold text-text-secondary">
            {enemyScore}
          </span>
        </div>

        <div
          className={cn("text-sm font-semibold", {
            "text-win": won,
            "text-loss": !won && !draw,
            "text-draw": draw,
          })}
        >
          {won ? "VICTORY" : draw ? "DRAW" : "DEFEAT"}
        </div>

        <div className="text-xs text-text-muted">
          {formatDuration(match.duration)} &middot; {match.startedAt}
        </div>
      </div>
    </motion.div>
  );
}
