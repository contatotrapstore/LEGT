"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { MatchPlayer } from "@/types/valorant";
import { cn, formatPercent } from "@/lib/utils";

interface TeamTableProps {
  players: MatchPlayer[];
  title: string;
  isPlayerTeam?: boolean;
}

export function TeamTable({
  players,
  title,
  isPlayerTeam = false,
}: TeamTableProps) {
  const sorted = [...players].sort((a, b) => b.stats.acs - a.stats.acs);

  return (
    <motion.div
      className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div
        className={cn("px-4 py-2 text-sm font-medium border-b border-border-subtle", {
          "text-win bg-win/5": isPlayerTeam,
          "text-loss bg-loss/5": !isPlayerTeam,
        })}
      >
        {title}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-muted text-xs border-b border-border-subtle">
              <th className="text-left px-4 py-2">Player</th>
              <th className="text-center px-2 py-2">ACS</th>
              <th className="text-center px-2 py-2">K</th>
              <th className="text-center px-2 py-2">D</th>
              <th className="text-center px-2 py-2">A</th>
              <th className="text-center px-2 py-2">+/-</th>
              <th className="text-center px-2 py-2">ADR</th>
              <th className="text-center px-2 py-2">HS%</th>
              <th className="text-center px-2 py-2">FK</th>
              <th className="text-center px-2 py-2">FD</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((player) => (
              <tr
                key={player.puuid}
                className={cn(
                  "border-b border-border-subtle/50 hover:bg-bg-card-hover transition-colors",
                  { "bg-rank-primary/5": player.isObserved }
                )}
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded shrink-0 overflow-hidden bg-bg-secondary">
                      {player.agentIcon ? (
                        <Image
                          src={player.agentIcon}
                          alt={player.agent}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">
                          {player.agent.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span
                      className={cn("truncate max-w-[120px]", {
                        "font-semibold text-rank-primary": player.isObserved,
                        "text-text-primary": !player.isObserved,
                      })}
                    >
                      {player.name}
                    </span>
                  </div>
                </td>
                <td className="text-center px-2 py-2 font-medium">
                  {player.stats.acs}
                </td>
                <td className="text-center px-2 py-2">{player.stats.kills}</td>
                <td className="text-center px-2 py-2">{player.stats.deaths}</td>
                <td className="text-center px-2 py-2">{player.stats.assists}</td>
                <td
                  className={cn("text-center px-2 py-2 font-medium", {
                    "text-win": player.stats.kills - player.stats.deaths > 0,
                    "text-loss": player.stats.kills - player.stats.deaths < 0,
                  })}
                >
                  {player.stats.kills - player.stats.deaths > 0 ? "+" : ""}
                  {player.stats.kills - player.stats.deaths}
                </td>
                <td className="text-center px-2 py-2">{player.stats.adr}</td>
                <td className="text-center px-2 py-2">
                  {formatPercent(player.stats.hsPercent)}
                </td>
                <td className="text-center px-2 py-2">
                  {player.stats.firstKills}
                </td>
                <td className="text-center px-2 py-2">
                  {player.stats.firstDeaths}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-border-subtle/50">
        {sorted.map((player) => (
          <div
            key={player.puuid}
            className={cn("px-4 py-3", {
              "bg-rank-primary/5": player.isObserved,
            })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded shrink-0 overflow-hidden bg-bg-secondary">
                  {player.agentIcon ? (
                    <Image
                      src={player.agentIcon}
                      alt={player.agent}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">
                      {player.agent.charAt(0)}
                    </div>
                  )}
                </div>
                <span
                  className={cn("text-sm", {
                    "font-semibold text-rank-primary": player.isObserved,
                    "text-text-primary": !player.isObserved,
                  })}
                >
                  {player.name}
                </span>
              </div>
              <div className="text-sm font-medium text-text-primary">
                {player.stats.kills}/{player.stats.deaths}/{player.stats.assists}
              </div>
            </div>
            <div className="flex gap-3 mt-1 text-xs text-text-muted">
              <span>{player.stats.acs} ACS</span>
              <span>{player.stats.adr} ADR</span>
              <span>{formatPercent(player.stats.hsPercent)} HS</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
