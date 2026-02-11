"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { AgentStats } from "@/types/valorant";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatPercent, formatNumber } from "@/lib/utils";

interface AgentCardProps {
  agent: AgentStats;
  delay?: number;
}

export function AgentCard({ agent, delay = 0 }: AgentCardProps) {
  return (
    <motion.div
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex items-center gap-4 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
    >
      {/* Agent icon */}
      <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-white/[0.05]">
        {agent.agentIcon ? (
          <Image
            src={agent.agentIcon}
            alt={agent.agentName}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 text-lg font-bold">
            {agent.agentName.charAt(0)}
          </div>
        )}
      </div>

      {/* Agent info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white truncate">
            {agent.agentName}
          </span>
          <Badge>{agent.role}</Badge>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-zinc-500">
          <span>
            <span className="text-white font-medium">
              {formatPercent(agent.winRate)}
            </span>{" "}
            WR
          </span>
          <span>
            <span className="text-white font-medium">
              {formatNumber(agent.kd, 2)}
            </span>{" "}
            K/D
          </span>
          <span>
            <span className="text-white font-medium">
              {agent.acs}
            </span>{" "}
            ACS
          </span>
          <span>
            <span className="text-white font-medium">
              {formatPercent(agent.pickRate)}
            </span>{" "}
            Pick
          </span>
        </div>

        {/* Win rate mini bar */}
        <ProgressBar
          value={agent.winRate}
          className="mt-2"
          color={agent.winRate >= 50 ? "green" : "red"}
        />
      </div>

      {/* Match count */}
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-white">
          {agent.matchesPlayed}
        </div>
        <div className="text-[11px] text-zinc-500">games</div>
      </div>
    </motion.div>
  );
}
