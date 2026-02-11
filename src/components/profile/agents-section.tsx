"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { AgentStats } from "@/types/valorant";
import { AgentCard } from "./agent-card";

interface AgentsSectionProps {
  agents: AgentStats[];
}

export function AgentsSection({ agents }: AgentsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const t = useTranslations("agents");

  if (agents.length === 0) return null;

  const visible = showAll ? agents : agents.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-red-500 rounded-full" />
        <h2 className="text-lg font-semibold text-white">{t("title")}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {visible.map((agent, i) => (
            <AgentCard key={agent.agentName} agent={agent} delay={i * 0.05} />
          ))}
        </AnimatePresence>
      </div>
      {agents.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-2 bg-white/[0.02] border border-white/[0.04] rounded-lg hover:bg-white/[0.04]"
        >
          {showAll ? t("showLess") : t("showAll")}
          <span className="ml-1">{showAll ? "\u25B2" : "\u25BC"}</span>
        </button>
      )}
    </div>
  );
}
