import type { HenrikLifetimeMatch } from "./api";

// ===== RANK SYSTEM =====

export type RankKey =
  | "unranked"
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "ascendant"
  | "immortal"
  | "radiant";

export interface RankInfo {
  tier: number; // 0-27
  tierName: string; // "Gold 2", "Radiant"
  rankKey: RankKey; // "gold", "radiant" (for theme)
  division: number; // 1, 2, 3 (0 for Radiant/Unranked)
  rr: number; // 0-100
  elo: number; // raw elo
  iconUrl: string;
}

// ===== PLAYER STATS =====

export interface PlayerStats {
  kills: number;
  deaths: number;
  assists: number;
  kd: number;
  acs: number;
  adr: number;
  hsPercent: number;
  bodyShotPercent: number;
  legShotPercent: number;
  winRate: number;
  kast: number;
  firstKills: number;
  firstDeaths: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  damagePerMatch: number;
  damageDelta: number;
  avgKillsPerMatch: number;
  avgDeathsPerMatch: number;
  avgAssistsPerMatch: number;
  scorePerMatch: number;
  currentStreak: number; // positive = win streak, negative = loss streak
  longestWinStreak: number;
}

export interface MapStats {
  mapName: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKills: number;
  avgDeaths: number;
  avgAcs: number;
  adr: number;
  kd: number;
}

// ===== AGENT STATS =====

export type AgentRole = "duelist" | "sentinel" | "controller" | "initiator";

export interface AgentStats {
  agentName: string;
  agentIcon: string;
  role: AgentRole;
  pickRate: number;
  winRate: number;
  kd: number;
  acs: number;
  adr: number;
  hsPercent: number;
  avgKills: number;
  avgDeaths: number;
  matchesPlayed: number;
}

// ===== MATCH =====

export type MatchResult = "win" | "loss" | "draw";
export type QueueType =
  | "competitive"
  | "unrated"
  | "deathmatch"
  | "teamdeathmatch"
  | "spikerush"
  | "escalation"
  | "replication"
  | "swiftplay"
  | "premier"
  | "custom"
  | "unknown";

export interface MatchSummary {
  matchId: string;
  map: string;
  mapIcon: string;
  mode: QueueType;
  score: { team: number; enemy: number };
  result: MatchResult;
  agent: string;
  agentIcon: string;
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  hsPercent: number;
  multiKills: {
    doubles: number;
    triples: number;
    quads: number;
    aces: number;
  };
  firstKill: boolean;
  badges: BadgeType[];
  playedAt: string; // ISO date
  roundsPlayed: number;
  tier: number;
  tierName: string;
  tierIcon: string;
  rrChange: number | null;
  rrAfter: number | null;
  damageMade: number;
  damageReceived: number;
  adr: number;
  shots: { head: number; body: number; leg: number };
  totalScore: number;
}

export interface MatchDetail {
  matchId: string;
  map: string;
  mapIcon: string;
  mode: QueueType;
  duration: number; // seconds
  startedAt: string;
  score: { blue: number; red: number };
  teams: {
    blue: MatchPlayer[];
    red: MatchPlayer[];
  };
  rounds: RoundData[];
}

export interface MatchPlayer {
  puuid: string;
  name: string;
  tag: string;
  agent: string;
  agentIcon: string;
  rank: number; // tier
  rankPatched: string;
  team: "blue" | "red";
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    acs: number;
    adr: number;
    hsPercent: number;
    firstKills: number;
    firstDeaths: number;
    multiKills: number;
    plants: number;
    defuses: number;
  };
  damageMade: number;
  damageReceived: number;
  partyId: string;
  isObserved: boolean; // is this the player we're looking at
}

export interface RoundData {
  roundNum: number;
  winningTeam: "blue" | "red";
  endType: string; // "Eliminated", "Bomb defused", etc.
}

// ===== BADGES =====

export type BadgeType =
  | "match_mvp"
  | "team_mvp"
  | "clutch_king"
  | "entry_fragger"
  | "headshot_machine"
  | "flawless"
  | "ace";

// ===== ACT / RANK JOURNEY =====

export interface ActData {
  actId: string;
  actName: string; // "Episode 8 Act 2"
  peakRank: RankInfo;
  wins: number;
  losses: number;
  rr: number;
}

// ===== ACCOUNT =====

export interface AccountData {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  accountLevel: number;
  card: {
    small: string;
    large: string;
    wide: string;
  };
  lastUpdate: string;
}

// ===== MMR =====

export interface MMRData {
  currentRank: RankInfo;
  peakRank: RankInfo;
  rankingInTier: number; // RR
  elo: number;
  gamesNeededForRating: number;
  seasonalData: Record<string, SeasonMMR>;
}

export interface SeasonMMR {
  wins: number;
  losses: number;
  gamesPlayed: number;
  finalRank: number;
  finalRankPatched: string;
  actRankWins: ActRankWin[];
}

export interface ActRankWin {
  patchedTier: string;
  tier: number;
}

export interface MMRHistoryEntry {
  currenttier: number;
  currenttierpatched: string;
  elo: number;
  mmr_change_to_last_game: number;
  ranking_in_tier: number;
  date: string;
  matchId: string;
}

// ===== PROFILE (aggregated) =====

export interface ProfileData {
  account: AccountData;
  mmr: MMRData;
  stats: PlayerStats;
  agentStats: AgentStats[];
  recentMatches: MatchSummary[];
  actHistory: ActData[];
  mapStats: MapStats[];
  rawMatches: HenrikLifetimeMatch[];
  mmrHistory: MMRHistoryEntry[];
}

// Re-export for client-side usage
export type { HenrikLifetimeMatch } from "@/types/api";
